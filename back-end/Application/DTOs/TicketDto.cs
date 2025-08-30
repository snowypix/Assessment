namespace backend.Application.DTOs
{
    public class TicketDto
    {
        public int Code { get; set; }
        public int TripId { get; set; }
        public int ClientId { get; set; }
        public int Class { get; set; }
        public string QrCode { get; set; }
        public int Price { get; set; }
    }
}
