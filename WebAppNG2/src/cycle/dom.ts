function set_id_class(tagName: string, elConfig: any) {
    let isFirst: boolean = true, ctagName = tagName, end, len = tagName.length;
    for (let i = 0; i < len; i++) {
        if (tagName[i] === '#') {
            if (isFirst) {
                isFirst = false;
                ctagName = tagName.substring(0, i);
            }
            i++;
            end = getEndIndex(i, len, tagName);
            elConfig.props.id = tagName.substring(i, end);
            i = end - 1;

        }
        else if (tagName[i] === '.') {
            if (isFirst) {
                isFirst = false;
                if (!elConfig.props.class) {
                    elConfig.props.class = '';
                }
                ctagName = tagName.substring(0, i);
            }
            i++;
            end = getEndIndex(i, len, tagName);
            elConfig.props.class += tagName.substring(i, end) + ' ';
            i = end - 1;

        }
    }
    elConfig.tagName = ctagName.toUpperCase();
}
function getEndIndex(startIndex, len, content) {
    while (startIndex < len && !(content[startIndex] === '.' || content[startIndex] === '#')) {
        startIndex++;
    }
    return startIndex;
}
function h_helper(params) {
    let obj: any = { props: {}, children: [] };
    if (Array.isArray(params[0])) {
        obj.children = params[0];
    }
    else if (typeof params[0] === 'object') {
        obj.props = params[0]
    }
    if (Array.isArray(params[1])) {
        obj.children = params[1];
    }
    return obj;
}
export function createElement(obj) {
    const el = document.createElement(obj.tagName);
    Object.keys(obj.props).forEach(prop => {
        if (prop === 'style') {
            for (let st in obj.props[prop]) {
                el.style[st] = obj.props[prop][st];
            }
        } else {
            el.setAttribute(prop, obj.props[prop]);
        }
    });
    obj.children.filter(child => typeof child === 'object').map(createElement).forEach(ch => {
        el.appendChild(ch);
    });
    obj.children.filter(child => typeof child === 'string').map(str => el.innerHTML += str);
    return el;
}
export const h = (tagName: string, ...params) => {
    let elConfig: any = h_helper(params);
    set_id_class(tagName, elConfig);
    return elConfig;
}