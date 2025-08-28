using System.ComponentModel.DataAnnotations;
using Microsoft.VisualBasic;

namespace back_end.Application.DTOs
{
    public class UpdateTripDTO
    {
        public DateTime DepartureDate { get; set; }
        [Required]

        public DateInterval Duration { get; set; }
        [Required]

        public DateInterval Delay { get; set; }
        [Required]
        public int Price { get; set; }
        public string Status { get; set; }

        [Required]
        public int DepartureStationId { get; set; }
        [Required]
        public int ArrivalStationId { get; set; }
        [Required]
        public int TrainId { get; set; }
    }
}