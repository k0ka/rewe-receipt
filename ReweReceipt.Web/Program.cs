using Autofac;
using Autofac.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReweReceipt.Web;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

builder.Host.UseServiceProviderFactory(new AutofacServiceProviderFactory())
    .ConfigureContainer<ContainerBuilder>(autofacBuilder => autofacBuilder.RegisterModule(new AutofacModule()));

builder.Services.AddOpenApi();
builder.Services.AddAntiforgery(options =>
    {
        options.HeaderName = "X-XSRF-TOKEN";
        options.SuppressXFrameOptionsHeader = false;
    }
);
builder.Services.AddControllersWithViews(options =>
    {
        options.Filters.Add(new AutoValidateAntiforgeryTokenAttribute());
    }
);

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DbContext"))
);

var app = builder.Build();

// Run migrations automatically
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference(options => options.WithJavaScriptConfiguration("/scalar/config.js"));
    app.UseDeveloperExceptionPage();
    app.UseMigrationsEndPoint();
}

var antiForgery = app.Services.GetRequiredService<IAntiforgery>();
app.Use(async (context, next) =>
    {
        if (!context.Request.Path.StartsWithSegments("/api"))
        {
            var tokenSet = antiForgery.GetAndStoreTokens(context);
            context.Response.Cookies.Append(
                "XSRF-TOKEN",
                tokenSet.RequestToken!,
                new CookieOptions { HttpOnly = false }
            );
        }

        await next(context);
    }
);

app.UseStaticFiles();
app.UseRouting();
app.MapControllers();
app.MapFallbackToFile("index.html");

app.Run();