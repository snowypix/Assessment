public class GetCurrentUserDto
{
    public string UserId { get; init; }
    public string Username { get; init; }
    public List<string> Roles { get; init; }
    public List<string> Permissions { get; init; }
}
