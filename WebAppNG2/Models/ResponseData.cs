using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace HCRS_API.Models
{
    public class ResponseData
    {
        public dynamic Data { get; set; }
        public int TotalPage { get; set; }
        public string Msg { get; set; }
        public string Error { get; set; }
    }
}