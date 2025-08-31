namespace back_end.Application.interfaces
{
    public interface IUserContext
    {
        string? GetUserId();
        string? GetUsername();
        List<string> GetRoles();
        List<string> GetPermissions();
    }
}
