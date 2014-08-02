using System;
using System.ComponentModel.DataAnnotations;
using System.Data.Entity;

namespace WebApplicationDevelopment.Models
{
    public class WatchlistModel
    {
        public class Watchlist
        {
            [Key]
            public int Id { get; set; }
            public string UserId { get; set; }
            public string Symbol { get; set; }
        }
    }
}