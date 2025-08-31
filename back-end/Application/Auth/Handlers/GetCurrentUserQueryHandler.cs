// Application/Users/Queries/GetCurrentUser/GetCurrentUserQueryHandler.cs
using back_end.Application.interfaces;
using MediatR;

public class GetCurrentUserQueryHandler : IRequestHandler<MyInformationsQuery, GetCurrentUserDto>
{
    private readonly IUserContext _userContext;

    public GetCurrentUserQueryHandler(IUserContext userContext)
    {
        _userContext = userContext;
    }

    public Task<GetCurrentUserDto> Handle(MyInformationsQuery request, CancellationToken cancellationToken)
    {
        var dto = new GetCurrentUserDto
        {
            UserId = _userContext.GetUserId(),
            Username = _userContext.GetUsername(),
            Roles = _userContext.GetRoles(),
            Permissions = _userContext.GetPermissions()
        };

        return Task.FromResult(dto);
    }
}
