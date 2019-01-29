namespace SpentBook.Web.ViewsModels
{
    public class ChangePasswordViewModel
    {
        public string UserId { get; set; }
        public string Code { get; set; }
        public string Password { get; set; }
        public string ConfirmPassword { get; set; }
    }
}
