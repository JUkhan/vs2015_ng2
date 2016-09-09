using HCRS_API.Models;
using System;
using System.Collections.Generic;
using System.Web;
using System.Web.Http;
using System.Threading.Tasks;
using System.Reactive.Linq;
using HCRS_API.Services.Upload;

namespace WebAppNG2.Controllers
{
    [RoutePrefix("api/Utilization")]
    public class UtilizationController : ApiController
    {
        private IUploadService uploadService;
        public UtilizationController()
        {
            this.uploadService = new UploadService();
        }

        [HttpPost]
        public async Task<IHttpActionResult> ImportClaimDataFile()
        {
            var fileName = Guid.NewGuid().ToString() + ".txt";
            var filePath = HttpContext.Current.Server.MapPath("~/ClaimDataFile/" + fileName);
            var res = await this.uploadService.SaveFile(HttpContext.Current.Request, filePath);
            res.Msg = fileName;
            return Ok(res);
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetFormattedClaimData(int pageSize, int pageNo, string fileName, string sort = "")
        {
            var filePath = HttpContext.Current.Server.MapPath("~/ClaimDataFile/" + fileName);

            return Ok(await this.uploadService.Having<ClaimFile>().GetPagedList(filePath, pageSize, pageNo, sort));
        }

        [HttpGet]
        [Route("GetProgramData")]
        public async Task<IHttpActionResult> GetProgramData()
        {
            return Ok(await this.uploadService.GetProgramData());
        }

        [HttpGet]
        public async Task<IHttpActionResult> UpdateClaimProgramId(int programId, string fileName)
        {
            var filePath = HttpContext.Current.Server.MapPath("~/ClaimDataFile/" + fileName);
            return Ok(await this.uploadService.UpdateClaimProgramId(programId, filePath));
        }

        [HttpPost]
        [Route("UpdateClaimRecords")]
        public async Task<IHttpActionResult> UpdateClaimRecords([FromBody] UpdateClaimRecords records)
        {
            var filePath = HttpContext.Current.Server.MapPath("~/ClaimDataFile/" + records.fileName);
            return Ok(await this.uploadService.UpdateClaimRecords(filePath, records.dataList));
        }

    }

    public class UpdateClaimRecords
    {
        public string fileName { get; set; }
        public List<ClaimData> dataList { get; set; }
    }

}
