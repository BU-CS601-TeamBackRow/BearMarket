using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web;
using System.Data;
using System.Data.SqlClient;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security;
using Owin;
using System.Collections.Specialized;

namespace WebApplicationDevelopment.Controllers
{
    public class PortfolioController : ApiController
    {
        [Route("api/portfolio")]
        [HttpPost]
        public IHttpActionResult addStockToPortfolio()
        {
            try
            {
                //Load Form variables into NameValueCollection variable.
                var coll = Request.GetQueryNameValuePairs().ToDictionary(x => x.Key, x => x.Value);                // TODO: Add insert logic here
                string connectionString = "Data Source=(LocalDB)\\v11.0;AttachDbFilename=C:\\Users\\Danny\\Documents\\GitHub\\BearMarket\\WebApplicationDevelopment\\App_Data\\Stocks.mdf;Integrated Security=True";

                // Provide the query string with a parameter placeholder. 
                string queryString =
                    "INSERT INTO dbo.portfolio "
                        + " VALUES(NEWID(), @userId, @symbol, @pricePaid, @sharesPurchased, null );";

                // Specify the parameter value. 
                string userId = User.Identity.GetUserId();
                string symbol = coll["Symbol"];
                string pricePaid = coll["PricePaid"];
                string sharesPurchased = coll["SharesPurchase"];


                // Create and open the connection in a using block. This 
                // ensures that all resources will be closed and disposed 
                // when the code exits. 
                using (SqlConnection connection =
                    new SqlConnection(connectionString))
                {
                    // Create the Command and Parameter objects.
                    SqlCommand command = new SqlCommand(queryString, connection);
                    command.Parameters.AddWithValue("@userId", userId);
                    command.Parameters.AddWithValue("@symbol", symbol);
                    command.Parameters.AddWithValue("@pricePaid", pricePaid);
                    command.Parameters.AddWithValue("@sharesPurchased", sharesPurchased);
                    // Open the connection in a try/catch block.  
                    // Create and execute the DataReader, writing the result 
                    // set to the console window. 
                    try
                    {
                        connection.Open();
                        Int32 rowsAffected = command.ExecuteNonQuery();
                    }
                    catch (System.Data.SqlClient.SqlException sqlException)
                    {
                        System.Windows.Forms.MessageBox.Show(sqlException.Message);
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine(ex.Message);
                    }
                    return Ok();
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                var resp = new HttpResponseMessage(HttpStatusCode.InternalServerError);
                throw new HttpResponseException(resp);
            }
        }
    }
}
