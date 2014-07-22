using System;
using System.ComponentModel.DataAnnotations;
using System.Data.Entity;

namespace WebApplicationDevelopment.Models
{
    public class Portfolio
    {
        [Key]
        public int Id { get; set; }
        public string UserId { get; set; }
        public string Symbol { get; set; }
        public float PricePaid { get; set; }
        public float SharesPurchase { get; set; }
        public float PriceSold { get; set; }        
    }
}