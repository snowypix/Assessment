// Application/Users/Queries/GetCurrentUser/GetCurrentUserQuery.cs
using MediatR;

public record MyInformationsQuery(string UserId) : IRequest<GetCurrentUserDto>;
