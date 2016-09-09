using System;
using System.Collections.Generic;
using System.Linq;
using System.Reactive;
using System.Web;
using System.Reactive.Linq;
using System.IO;
using HCRS_API.Models;
using HCRS_API.Services.Upload;

namespace HCRS_API.Services.Upload
{
    public class UploadService : IUploadService
    {
        public IObservable<ResponseData> GetProgramData()
        {
            var res = new ResponseData();
            res.Data = new List<DropdownData>
            {
                new DropdownData {Value=14, Name="Program 1" },
                new DropdownData {Value=17, Name="Program 2" }
            };
            return Observable.Return(res);
        }

        public T Having<T>()
        {
            return (T)Activator.CreateInstance(typeof(T), new object[] { });
        }

        public IObservable<ResponseData> SaveFile(HttpRequest request, string filePath)
        {
            return Observable.Create<ResponseData>(
            o => Observable.ToAsync<HttpRequest, string, ResponseData>(this.SaveFileHelper)(request, filePath).Subscribe(o)
            );

        }

        public IObservable<ResponseData> UpdateClaimProgramId(int programId, string filePath)
        {
            var res = new ResponseData();
            var fileProcess = new ClaimFile();
            var list =fileProcess.GetRecordList(filePath);
            foreach (var item in list)
            {
                item.PgmId = programId;
            }
            fileProcess.UpdateFile(filePath, list);
            return Observable.Return(res);
        }

        public IObservable<ResponseData> UpdateClaimRecords(string filePath, List<ClaimData> updatedlist)
        {
            var res = new ResponseData();
            var fileProcess = new ClaimFile();
            var list = fileProcess.GetRecordList(filePath);
            foreach (var item in updatedlist)
            {
                var record = list.Find(_ => _.Line == item.Line);
                record.PgmId = item.PgmId;
                record.StateCd = item.StateCd;
                record.Ndc11 = item.Ndc11;
                record.PeriodCoveredQYYYY = item.PeriodCoveredQYYYY;
            }
            fileProcess.UpdateFile(filePath, list);
            res.Msg = "Successfully updated";
            return Observable.Return(res);
        }

        private ResponseData SaveFileHelper(HttpRequest request, string filePath)
        {
            var res = new ResponseData();
            try
            {
                if (request.Files.Count > 0)
                {
                    foreach (string file in request.Files)
                    {
                        var postedFile = request.Files[file];

                        if (File.Exists(filePath))
                        {
                            File.Delete(filePath);
                        }
                        postedFile.SaveAs(filePath);
                    }
                }

                res.Msg = "Successfully Updated";
            }
            catch (Exception ex)
            {

                res.Error = ex.ToString();
            }

            return res;
        }

    }
}