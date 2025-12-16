using Autofac;
using ReweReceipt.Web.Services;

namespace ReweReceipt.Web;

public class AutofacModule : Module
{
    protected override void Load(ContainerBuilder builder)
    {
        builder.RegisterType<FetchService>().AsSelf().SingleInstance();
    }
}