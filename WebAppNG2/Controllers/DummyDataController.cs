using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace WebAppNG2.Controllers
{   
    public class DummyDataController : Controller
    {
        private static List<Scholar> scholarList = new List<Scholar>
        {
            new Scholar {id=1, age=23, name="Abdulla", hasChild=true,  address=101, education=1, description="Description" },
            new Scholar {id=2, age=22,name="Arif1",    hasChild=true,  address=102, education=2, description="Description" },
            new Scholar {id=3, age=25,name="Sobuj",    hasChild=false, address=103, education=3, description="Description" },
            new Scholar {id=4, age=26,name="Fruk1",    hasChild=false, address=101, education=4, description="Description" },
            new Scholar {id=5, age=27,name="Ranu1",    hasChild=true,  address=102, education=1, description="Description" }
        };
        public JsonResult GetScholarList()
        {
            
            return Json(scholarList, JsonRequestBehavior.AllowGet);
        }
        public JsonResult create_update_scholar(Scholar scholar)
        {
            if (scholar.id!=null)
            {
                var temp = scholarList.Find(_ => _.id == scholar.id);
                temp.name = scholar.name;
                temp.age = scholar.age;
                temp.education = scholar.education;
                scholar = temp;
               
            }
            else
            {
                scholar.id = scholarList.Count + 1;
                scholarList.Add(scholar);
            }
            return Json(scholar);
        }
        public JsonResult remove_scholar(int id)
        {
            var temp = scholarList.Find(_ => _.id == id);
            scholarList.Remove(temp);
            return Json(new { msg="Removed" }, JsonRequestBehavior.AllowGet);
        }
        public JsonResult getEducations()
        {
            var list = new List<NameValue>
            {
                new NameValue { text="CSE", value=1 },
                new NameValue { text="BBA", value=2 },
                new NameValue { text="MBA", value=3 },
                new NameValue { text="EEE", value=4 },
            };
            return Json(list, JsonRequestBehavior.AllowGet);
        }

        public JsonResult getAddress(int id)
        {
            var list = new List<NameValue>
            {
                new NameValue { text="Address-1", value=101 },
                new NameValue { text="Address-2", value=102 },
                new NameValue { text="Address-3", value=103 },
                new NameValue { text="Address-4", value=104 },
            };
            return Json(list, JsonRequestBehavior.AllowGet);
        }
    }

    public class NameValue
    {
        public int value { get; set; }
        public string text { get; set; }
    }
    
    public class Scholar
    {
        public int? id { get; set; }
        public string name { get; set; }
        public bool hasChild { get; set; }
        public int education { get; set; }
        public int address { get; set; }
        public string description { get; set; }
        public int age { get; set; }
    }
}