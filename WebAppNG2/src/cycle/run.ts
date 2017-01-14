import {Observable, Subject, Subscription} from 'rxjs/Rx';
import {adapter} from './adapter';
export const run = function (main, drivers) {
    const sinkProxies = makeSinkProxies(drivers, adapter);
    const sources = callDrivers(drivers, sinkProxies, adapter);
    const sinks = main(sources);
    const disposeReplication = replicateMany(sinks, sinkProxies, adapter);
    return () => {
        disposeSources(sources);
        disposeReplication();
    };
}

function makeSinkProxies(drivers: any, streamAdapter:any) {
    const sinkProxies = {};
    for (let name in drivers) {
        if (drivers.hasOwnProperty(name)) {
            const subject = streamAdapter.makeSubject();
            const driverStreamAdapter = drivers[name].streamAdapter || streamAdapter;
            const stream = driverStreamAdapter.adapt(subject.stream, streamAdapter.streamSubscribe);
            sinkProxies[name] = { stream, observer: subject.observer};
        }
    }
    return sinkProxies;
}
function callDrivers(drivers:any, sinkProxies:any, streamAdapter) {
    const sources = [];
    for (let name in drivers) {
        const driverOutput = drivers[name](
            sinkProxies[name].stream,
            streamAdapter, name
        );
        const driverStreamAdapter = drivers[name].streamAdapter;
        if (driverStreamAdapter && driverStreamAdapter.isValidStream(driverOutput)) {
            sources[name] = streamAdapter.adapt(
                driverOutput,
                driverStreamAdapter.streamSubscribe
            );
        } else {
            sources[name] = driverOutput;
        }
    }
    return sources;
}
function replicateMany(sinks: any, sinkProxies: any, streamAdapert: any) {
    const sinkNames = Object.keys(sinks).filter(name => !!sinkProxies[name]);
    const buffers = {};
    const replicators = {};
    sinkNames.forEach(name => {
        buffers[name] = {
            next: [], error: [], complete: []
        };
        replicators[name] = {
            next: x => buffers[name].next.push(x),
            error: x => buffers[name].error.push(x),
            complete: x => buffers[name].complete.push(x)
        };
    });
    const subscriptions = sinkNames.map(name => {
        return streamAdapert.streamSubscribe(
            sinks[name], {
                next(x: any) { replicators[name].next(x); },
                error(x: any) { replicators[name].error(x); },
                complete(x?: any) { replicators[name].complete(x); }
            }
        );
    });
    const disposeFunctions = subscriptions.filter(fn => typeof fn === 'function');
    sinkNames.forEach((name) => {
        const observer = sinkProxies[name].observer;
        const next = observer.next;
        const error = observer.error;
        const complete = observer.complete;
        buffers[name].next.forEach(next);
        buffers[name].error.forEach(error);
        buffers[name].complete.forEach(complete);
        replicators[name].next = next;
        replicators[name].error = error;
        replicators[name].complete = complete;
    });

    return () => {
        disposeFunctions.forEach(dispose => dispose());
    };

}

function disposeSources<Sources>(sources: any) {
    for (let k in sources) {
        if (sources.hasOwnProperty(k) && sources[k]
            && typeof sources[k].dispose === 'function') {
            sources[k].dispose();
        }
    }
}