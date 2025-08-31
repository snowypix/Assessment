using Xunit;
using Moq;
using System.Threading;
using System.Threading.Tasks;
using back_end.Application.interfaces;

public class GetCurrentUserQueryHandlerTests
{
    private readonly Mock<IUserContext> _userContextMock;
    private readonly GetCurrentUserQueryHandler _handler;

    public GetCurrentUserQueryHandlerTests()
    {
        _userContextMock = new Mock<IUserContext>();
        _handler = new GetCurrentUserQueryHandler(_userContextMock.Object);
    }

    [Fact]
    public async Task Handle_ShouldReturnUserInfo_WhenUserExists()
    {

        _userContextMock.Setup(x => x.GetUserId()).Returns("123");
        _userContextMock.Setup(x => x.GetUsername()).Returns("yassine");
        _userContextMock.Setup(x => x.GetRoles()).Returns(new List<string> { "Admin" });
        _userContextMock.Setup(x => x.GetPermissions()).Returns(new List<string> { "Read", "Write" });

        var query = new MyInformationsQuery("123");


        var result = await _handler.Handle(query, CancellationToken.None);


        Assert.Equal("123", result.UserId);
        Assert.Equal("yassine", result.Username);
        Assert.Contains("Admin", result.Roles);
        Assert.Equal(2, result.Permissions.Count);
    }

    [Fact]
    public async Task Handle_ShouldReturnEmptyRoles_WhenUserHasNoRoles()
    {

        _userContextMock.Setup(x => x.GetUserId()).Returns("123");
        _userContextMock.Setup(x => x.GetUsername()).Returns("testuser");
        _userContextMock.Setup(x => x.GetRoles()).Returns(new List<string>());
        _userContextMock.Setup(x => x.GetPermissions()).Returns(new List<string> { "Read" });

        var query = new MyInformationsQuery("123");


        var result = await _handler.Handle(query, CancellationToken.None);


        Assert.Empty(result.Roles);
        Assert.Single(result.Permissions);
    }

    [Fact]
    public async Task Handle_ShouldReturnNullUsername_WhenUserHasNoName()
    {

        _userContextMock.Setup(x => x.GetUserId()).Returns("456");
        _userContextMock.Setup(x => x.GetUsername()).Returns((string?)null);
        _userContextMock.Setup(x => x.GetRoles()).Returns(new List<string>());
        _userContextMock.Setup(x => x.GetPermissions()).Returns(new List<string>());

        var query = new MyInformationsQuery("456");


        var result = await _handler.Handle(query, CancellationToken.None);


        Assert.Null(result.Username);
        Assert.Equal("456", result.UserId);
    }

    [Fact]
    public async Task Handle_ShouldMatchQueryUserId_WhenDifferentFromContext()
    {

        _userContextMock.Setup(x => x.GetUserId()).Returns("999");
        _userContextMock.Setup(x => x.GetUsername()).Returns("stranger");
        _userContextMock.Setup(x => x.GetRoles()).Returns(new List<string> { "Guest" });
        _userContextMock.Setup(x => x.GetPermissions()).Returns(new List<string> { "Read" });

        var query = new MyInformationsQuery("999");


        var result = await _handler.Handle(query, CancellationToken.None);


        Assert.Equal("999", result.UserId);
        Assert.Equal("stranger", result.Username);
    }
}
