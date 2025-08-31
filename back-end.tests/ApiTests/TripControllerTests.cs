using back_end.Application.DTOs;
using backend.Api.Controllers;
using backend.API.Controllers;
using backend.Application.Trips.Commands;
using backend.Application.Trips.Queries;
using backend.Domain.Models;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

public class TripControllerTests
{
    [Fact]
    public async Task GetTrips_ReturnsOkWithData()
    {
        var trip = new TripScheduleDTO(
            Id: 1,
            DepartureDate: DateTime.UtcNow,
            Duration: 120,
            Delay: 0,
            Status: "Scheduled",
            Price: 100,
            DepartureStationId: 1,
            ArrivalStationId: 2,
            TrainType: "HighSpeed"
        );
        var mockMediator = new Mock<IMediator>();
        mockMediator.Setup(m => m.Send(It.IsAny<CheckSchedulesQuery>(), default))
                    .ReturnsAsync(new List<TripScheduleDTO> { trip });

        var controller = new TripController(mockMediator.Object);
        var result = await controller.CheckSchedules(1, 2, DateTime.UtcNow);
        var okResult = result.Result as OkObjectResult;

        Assert.NotNull(okResult);
        var trips = okResult.Value as IEnumerable<TripScheduleDTO>; ;
        Assert.NotNull(trips);
    }
}
