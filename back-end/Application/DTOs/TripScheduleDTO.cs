using Microsoft.VisualBasic;

namespace back_end.Application.DTOs
{
    public record TripScheduleDTO(
    int Id,
    DateTime DepartureDate,
    int DepartureStationId,
    int ArrivalStationId,
    string TrainType,
    int Price,
    int Duration,
    int Delay,
    string Status
    );

}