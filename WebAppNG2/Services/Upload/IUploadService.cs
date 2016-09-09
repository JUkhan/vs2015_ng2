using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Reactive.Linq;
using System.Reactive;
using HCRS_API.Models;

namespace HCRS_API.Services.Upload
{
    public interface IUploadService
    {       
        IObservable<ResponseData> SaveFile(HttpRequest request, string filePath);
        T Having<T>();
        IObservable<ResponseData> GetProgramData();
        IObservable<ResponseData> UpdateClaimProgramId(int programId, string filePth);
        IObservable<ResponseData> UpdateClaimRecords(string filePth, List<ClaimData> list);
    }
}