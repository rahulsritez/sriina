
var express = require("express"),
  routes = require("./routes"),
  user = require("./routes/user"),
  admingrocery = require("./routes/admingrocery"),
  order = require("./routes/order"),
  product = require("./routes/product"),
  search = require("./routes/search"),
  signin = require("./routes/signin"),
  pages = require("./routes/pages"),
  myaccount = require("./routes/myaccount"),
  payumoney = require("./routes/payumoney"),
  grocery = require("./routes/grocery"),
  electronic = require("./routes/electronic"),
  uploadcsv = require("./routes/uploadcsv"),
  updateexcel = require("./routes/updateexcel"),
  state = require("./routes/state"),
  http = require("http"),
  path = require("path");

const helmet = require("helmet");
var app = express();
var mysql = require("mysql2");
const bodyParser = require("body-parser");
var session = require("express-session");
var expressValidator = require("express-validator");
var engines = require("consolidate");
var cookieParser = require("cookie-parser");
var csrf = require("csurf");
var fs = require("fs");
const flash = require("connect-flash");
const { SitemapStream, streamToPromise } = require("sitemap");
const { createGzip } = require("zlib");
const { Readable } = require("stream");
let sitemap;

// app.use(
//   helmet({
//     contentSecurityPolicy: {
//       directives: {
//         defaultSrc: ["'self'"],
//         scriptSrc: [
//           "'self'",
//           "https://www.googletagmanager.com",
//           "https://cdn.sriina.com", // Add CDN for scripts if used
//           "'unsafe-inline'", // For inline scripts (e.g., Google Tag Manager)
//         ],
//         styleSrc: [
//           "'self'",
//           "https://fonts.googleapis.com",
//           "https://cdn.sriina.com", // Add CDN for CSS if used
//           "'unsafe-inline'", // For inline styles
//         ],
//         fontSrc: ["'self'", "https://fonts.gstatic.com"],
//         imgSrc: [
//           "'self'",
//           "data:",
//           "https://sriina.com",
//           "https://cdn.sriina.com", // Add CDN for images if used
//           process.env.IMAGE_URL || "https://sriina.com", // Fallback to sriina.com if IMAGE_URL undefined
//         ],
//         connectSrc: ["'self'", "https://www.googletagmanager.com"],
//         frameSrc: ["'self'", "https://www.googletagmanager.com"],
//         objectSrc: ["'none'"],
//         upgradeInsecureRequests: [], // Enforce HTTPS
//       },
//     },
//     xFrameOptions: { action: "deny" }, // Prevent clickjacking
//     hsts: { maxAge: 31536000, includeSubDomains: true, preload: true }, // Enforce HTTPS
//     contentTypeOptions: true, // Prevent MIME-type sniffing
//     xssFilter: true, // Enable XSS filter
//     referrerPolicy: { policy: "strict-origin-when-cross-origin" }, // Control referrer information
//   })
// );


app.use(flash());

// Setup route middlewares
var csrfProtection = csrf({ cookie: true });

app.use((req, res, next) => {
  if (["POST", "PUT", "PATCH", "DELETE"].includes(req.method)) {
    return csrfProtection(req, res, next);
  }
  next();
});

var parseForm = bodyParser.urlencoded({ extended: true });

var connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("Connection Established Successfully!");
});
global.db = connection;
global.baseURL = "https://sriina.com/";

app.use(cookieParser());
app.use(
  session({
    secret: "sosecret",
    cookie: { maxAge: 8 * 60 * 60 * 1000, secure: false }, // Secure cookie for HTTPS
    saveUninitialized: true,
    resave: true,
  })
);

app.use(function (req, res, next) {
  res.locals.user = req.session.user;
  next();
});

// Middleware to add rel="noopener noreferrer" to external links with target="_blank"
app.use(function (req, res, next) {
  const originalRender = res.render;
  res.render = function (view, options, callback) {
    originalRender.call(this, view, options, (err, html) => {
      if (err) return callback ? callback(err) : next(err);
      // Add rel="noopener noreferrer" to external links with target="_blank"
      html = html.replace(
        /<a\s+([^>]*?)target="_blank"([^>]*)>/gi,
        (match, before, after) => {
          if (!/rel=/.test(match)) {
            return `<a ${before}target="_blank" rel="noopener noreferrer"${after}>`;
          }
          return match;
        }
      );
      callback ? callback(null, html) : res.send(html);
    });
  };
  next();
});

// All environments
const port = 3000;
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));

// Routes (same as original, included for completeness)
app.get("/robots.txt", function (req, res) {
  res.type("text/plain");
  res.send(
    "User-agent: *\nDisallow: /admin/\nSitemap: https://sriina.com/sitemap.xml"
  );
});

app.get("/test", (req, res) => res.send("Server is running"));
app.get("/", routes.landingpage);
app.get("/admin", routes.admin);
app.get("/login", routes.indexpage);
app.get("/dashboard", routes.logincheck);
app.get("/signup", user.signup);
app.post("/login", user.login);
app.post("/signup", user.signup);
app.get("/home/dashboard", user.dashboard);
app.get("/logout", user.logout);
app.get("/productlist", user.productpage);
app.get("/countrypage", user.countrypage);
app.get("/citypage", user.citypage);
app.get("/statepage", user.statepage);
app.get("/categorypage", user.categorypage);
app.get("/catalogpage", user.catalogpage);
app.get("/catalogcondition", user.catalogcondition);
app.get("/carttspage", user.cartspage);
app.get("/subcategorypage", user.subcategorypage);
app.get("/customerpage", csrfProtection, user.customerpage);
app.get("/web_settings", csrfProtection, user.webSetting);
app.post("/updatepermission", user.updatePermission);
app.post("/addcountry", user.Addcountry);
app.post("/editcountry", user.Editcountry);
app.post("/updatecountry", user.Updatecountry);
app.post("/deletecountry", user.Deletecountry);
app.post("/addstate", user.Addstate);
app.post("/editstate", user.Editstate);
app.post("/updatestate", user.Updatestate);
app.post("/deletestate", user.Deletestate);
app.post("/countrywisestate", user.Countrywisestate);
app.post("/addcity", user.Addcity);
app.post("/editcity", user.Editcity);
app.post("/updatecity", user.Updatecity);
app.post("/deletecity", user.Deletecity);
app.post("/addcustomer", parseForm, csrfProtection, user.Addcustomer);
app.post("/updatecustomer", routes.authGaurd, user.Updatecustomer);
app.post("/deletecustomer", routes.authGaurd, user.Deletecustomer);
app.post("/addcategory", routes.authGaurd, user.Addcategory);
app.post("/addcatalog", routes.authGaurd, user.Addcatalog);
app.post("/addcatalogcondition", routes.authGaurd, user.Addcatalogcondition);
app.post("/addcarts", user.Addcart);
app.post("/editcategory", routes.authGaurd, user.Editcategory);
app.post("/updatecategory", routes.authGaurd, user.Updatecategory);
app.post("/updatecartts", user.Updatecartts);
app.post("/updatecatalog", routes.authGaurd, user.Updatecatalog);
app.post("/deletecategory", routes.authGaurd, user.Deletecategory);
app.get("/deletecatalog/:id", routes.authGaurd, user.Deletecatalog);
app.get("/deletecatalogcondition/:id", routes.authGaurd, user.Deletecatalogcondition);
app.get("/deletecarts/:id", user.Deletecarts);
app.post("/addsubcategory", routes.authGaurd, user.Addsubcategory);
app.post("/editsubcategory", routes.authGaurd, user.Editsubcategory);
app.post("/updatesubcategory", routes.authGaurd, user.Updatesubcategory);
app.post("/deletesubcategory", routes.authGaurd, user.Deletesubcategory);
app.post("/categorywisesubcategory", routes.authGaurd, user.Categorywisesubactegory);
app.post("/addproduct", routes.authGaurd, user.Addproduct);
app.post("/adminupdateproduct", routes.authGaurd, user.AdminUpdateProduct);
app.post("/editproduct", routes.authGaurd, user.Editproduct);
app.post("/updateproduct", routes.authGaurd, user.Updateproduct);
app.post("/deleteproduct", routes.authGaurd, user.Deleteproduct);
app.post("/checkuniqueISBM13", user.checkUniqueISBM13);
app.post("/userresetpwd", parseForm, csrfProtection, user.userResetPwd);
app.post("/delay_box_massege", parseForm, csrfProtection, order.delayBoxMassege);
app.post("/cancel_product_from_admin", parseForm, csrfProtection, order.cancelProductFromAdmin);
app.post("/update_product_status", parseForm, csrfProtection, order.updateProductStatus);
app.get("/statedeliverycharge", state.stateDeliveryCharge);
app.post("/updatestatedeliverycharge", state.updateStateDeliveryCharge);
app.get("/admin404", admingrocery.admin404);
app.get("/grocerylist", csrfProtection, admingrocery.groceryPage);
app.post("/addgroceryproduct", parseForm, admingrocery.addGroceryProduct);
app.post("/get_grocery_sub_category", user.getGrocerySubCategory);
app.post("/get_brands", admingrocery.getBrands);
app.post("/updategroceyproducts", parseForm, csrfProtection, admingrocery.updateGroceryProducts);
app.get("/adminpwd", csrfProtection, myaccount.adminPassword);
app.post("/saveadminpwd", parseForm, csrfProtection, myaccount.saveAdminPwd);
app.post("/saveadminpwdotp", parseForm, csrfProtection, myaccount.saveAdminPwdOTP);
app.get("/adminpwdotp", csrfProtection, myaccount.adminPasswordOTP);
app.get("/updatediscount", user.Updateddiscount);
app.post("/savediscount", user.saveDiscount);
app.get("/orderpage", csrfProtection, order.orderpage);
app.get("/vieworder", order.orderViewPage);
app.get("/primemembership", order.primeMembership);
app.get("/viewprimeorder", order.viewPrimeOrder);
app.post("/addprimebook", order.addPrimeBook);
app.get("/user/vieworder/:id", routes.authGaurd, myaccount.userViewOrder);
app.get("/user/cancelitem", routes.authGaurd, csrfProtection, myaccount.cancelItem);
app.post("/cancle_item_success", parseForm, csrfProtection, myaccount.cancleItemSuccess);
app.get("/user/order-tracking", csrfProtection, myaccount.orderTracking);
app.get("/error_page", signin.errorPage);
app.get("/products", product.allProducts);
app.get("/homeslider", order.homeSlider);
app.post("/addslider", order.addSlider);
app.post("/updateslider", order.UpdateSlider);
app.get("/addtocart", product.cartAdd);
app.post("/preorder", parseForm, csrfProtection, product.preOrderProduct);
app.get("/admin-pre-order-products", user.adminPreOrderProducts);
app.get("/state-on-rent", csrfProtection, user.stateONRent);
app.post("/addstateonrent", parseForm, csrfProtection, user.addStateonRent);
app.post("/update-state-onrent", parseForm, csrfProtection, user.updateStateonRent);
app.post("/delete-state-onrent", user.deleteStateonRent);
app.get("/updatecart", routes.authGaurd, product.updateCart);
app.post("/saveaddtocart", parseForm, csrfProtection, product.saveAddtoCart);
app.get("/checkpincode", product.checkPinNumber);
app.get("/myaccount", routes.authGaurd, myaccount.UserAccount);
app.get("/profile", routes.authGaurd, myaccount.UserProfile);
app.get("/sritezprime", csrfProtection, myaccount.sritezPrime);
app.post("/membership_book_request", parseForm, csrfProtection, routes.authGaurd, myaccount.membershipBookRequest);
app.get("/vendorpage", csrfProtection, user.vendorPage);
app.post("/updatevendor", user.updateVendor);
app.get("/vendor_register", csrfProtection, signin.vendorRegister);
app.post("/vendorregisterfrm", parseForm, csrfProtection, routes.authGaurd, signin.vendorRegisterFrm);
app.get("/sign-in", csrfProtection, signin.userSignIn);
app.post("/registerusers", parseForm, csrfProtection, signin.userRegisters);
app.get("/contact-us", csrfProtection, signin.userContactUs);
app.post("/contactus", parseForm, csrfProtection, signin.userContactUsSave);
app.get("/users/dashboard", routes.authGaurd, signin.dashboardProfile);
app.post("/userlogin", parseForm, csrfProtection, signin.userLogin);
app.get("/userlogout", signin.userLogout);
app.post("/delete-cart", routes.authGaurd, signin.deleteInCart);
app.post("/addcallback", signin.addCallBack);
app.get("/checkout", csrfProtection, routes.authGaurd, signin.shoppingCheckOut);
app.get("/getcaptcha", signin.getCaptchaajax);
app.post("/billing_information", parseForm, csrfProtection, routes.authGaurd, signin.billingInformation);
app.post("/shipping_information", parseForm, csrfProtection, routes.authGaurd, signin.shippingInformation);
app.get("/delete_shipping_address", signin.deleteShippingAddress);
app.get("/delete_billing_address", signin.deleteBillingAddress);
app.post("/create-checkout-session", signin.stripePayment);
app.post("/razorpay-checkout", routes.authGaurd, signin.razorpayPaymentStatus);
app.get("/payment_status", signin.orderPaymentStatus);
app.post("/confim_order", signin.confimOrder);
app.post("/prime_confim_order", parseForm, csrfProtection, signin.PrimeConfimOrder);
app.post("/razorpay-membership-checkout", routes.authGaurd, signin.razorpayMembershipPayment);
app.get("/payment_membership_status", routes.authGaurd, signin.membershipPaymentStatus);
app.post("/register_user_plan", parseForm, csrfProtection, signin.registerUserPlan);
app.get("/membership_checkout", csrfProtection, routes.authGaurd, signin.membershipCheckout);
app.get("/forgot-password", csrfProtection, signin.forgotPassword);
app.get("/verifyotp", csrfProtection, signin.otpVerify);
app.post("/verifiedotp", parseForm, csrfProtection, signin.verifiedOTP);
app.post("/userforgotpwd", parseForm, csrfProtection, signin.forgotPwd);
app.get("/resetpwd", csrfProtection, signin.resetPWD);
app.post("/resetpwdsave", csrfProtection, signin.resetPwdSave);
app.get("/menupages", csrfProtection, user.menuPages);
app.post("/addmenu", parseForm, csrfProtection, user.menuPagesPost);
app.post("/updatemenu", parseForm, csrfProtection, user.menuPagesUpdate);
app.get("/webpages", user.webPages);
app.post("/addpages", user.addPages);
app.post("/editpages", user.editPages);
app.post("/payumoney", payumoney.payUMoney);
app.post("/payment/success", payumoney.PaymentSuccess);
app.post("/payment/failure", payumoney.PaymentFailure);
app.post("/primePayUMoney", payumoney.primePayUMoney);
app.post("/payment/membership_success", payumoney.PaymentMembershipSuccess);
app.post("/payment/membership_failure", payumoney.PaymentMembershipFailure);
app.get("/grocery", grocery.groceryIndex);
app.get("/p/groceries/:slug/:id", csrfProtection, grocery.viewGroceryProduct);
app.post("/groceyaddtocart", parseForm, csrfProtection, grocery.addtoCartGroceryProducts);
app.get("/electronic", electronic.electronicIndex);
app.get("/terms-conditions", pages.termsPage);
app.get("/shipping-delivery", pages.shippingDeliveryPage);
app.get("/about-us", pages.aboutPage);
app.get("/return-policy", pages.returnPolicy);
app.get("/privacy-policy", pages.privacyPolicy);
app.get("/cancellation-returns", pages.cancellationReturns);
app.get("/security", pages.security);
app.get("/contact", pages.contactPage);
app.get("/categories", product.categoryPage);
app.get("/search", search.searchResult);
app.get("/viewpost/:id", search.viewSearch);
app.get("/adminplanpage", routes.authGaurd, order.adminPlanPage);
app.post("/editmembershipplan", routes.authGaurd, order.editMembershipPlan);
app.get("/uploadexcel", routes.authGaurd, csrfProtection, uploadcsv.uploadExcel);
app.get("/find-missing-image", uploadcsv.findMissingImage);
const __basedir = path.resolve();
const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __basedir + "/exceldata/");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname);
  },
});
const uploadFile = multer({ storage: storage });
app.post("/uploadexcelfile", uploadFile.single("uploadexcel"), routes.authGaurd, uploadcsv.uploadExcelFile);
app.post("/uploads-xlsx", routes.authGaurd, uploadcsv.saveExcelFileData);
app.get("/updateexcel", routes.authGaurd, csrfProtection, updateexcel.uploadExcel);
app.post("/updateexcelfile", uploadFile.single("updateexcel"), routes.authGaurd, updateexcel.uploadExcelFile);
app.post("/update-xlsx", routes.authGaurd, updateexcel.saveExcelFileData);
app.get("/getMarketingTSVfile", electronic.getProductionTSVfile);

// Sitemap routes
app.get("/sitemap_index.xml", (req, res) => {
  const filePath = path.join(__dirname, "sitemap_index.xml");
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error("Error sending file:", err);
      res.status(500).send("Error occurred while sending the file.");
    }
  });
});

app.get("/sitemap.xml", async (req, res) => {
  try {
    const categories = await product.getCategoriesxml();

    let sitemapIndexXML = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    sitemapIndexXML += `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    // Add the new category sitemap
    sitemapIndexXML += `  <sitemap>\n`;
    sitemapIndexXML += `    <loc>https://sriina.com/sitemap/categorypages.xml</loc>\n`;
    sitemapIndexXML += `    <lastmod>${new Date().toISOString()}</lastmod>\n`;
    sitemapIndexXML += `  </sitemap>\n`;

    if (categories.length > 0) {
      categories.forEach((category) => {
        sitemapIndexXML += `  <sitemap>\n`;
        sitemapIndexXML += `    <loc>https://sriina.com/sitemap/${category.url_name}.xml</loc>\n`;
        sitemapIndexXML += `    <lastmod>${new Date().toISOString()}</lastmod>\n`;
        sitemapIndexXML += `  </sitemap>\n`;
      });
    }

    sitemapIndexXML += `</sitemapindex>`;

    res.header("Content-Type", "application/xml");
    res.send(sitemapIndexXML);
  } catch (err) {
    res.status(500).send("Error generating sitemap.");
  }
});

app.get("/sitemap/categorypages.xml", async (req, res) => {
  const categories = [
    "https://sriina.com/academic-books",
    "https://sriina.com/account-books",
    "https://sriina.com/aging-books",
    "https://sriina.com/allied-health-books",
    "https://sriina.com/astronomy-books",
    "https://sriina.com/autobiography",
    "https://sriina.com/banking-insurance-books",
    "https://sriina.com/banking-and-negotiable-instruments-books",
    "https://sriina.com/biography-books",
    "https://sriina.com/biology-life-science",
    "https://sriina.com/products",
    "https://sriina.com/medical-books",
    "https://sriina.com/terms-conditions",
    "https://sriina.com/shipping-delivery",
    "https://sriina.com/about-us",
    "https://sriina.com/return-policy",
    "https://sriina.com/privacy-policy",
    "https://sriina.com/cancellation-returns",
    "https://sriina.com/security",
    "https://sriina.com/contact",
    "https://sriina.com/sign-in",
    "https://sriina.com/vendor"
  ];

  let sitemapXML = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  sitemapXML += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  categories.forEach((url) => {
    sitemapXML += `  <url>\n`;
    sitemapXML += `    <loc>${url}</loc>\n`;
    sitemapXML += `    <lastmod>2025-08-20</lastmod>\n`;
    sitemapXML += `    <changefreq>weekly</changefreq>\n`;
    sitemapXML += `    <priority>${url.includes("products") || url.includes("medical-books") ? 0.9 : 0.8}</priority>\n`;
    sitemapXML += `  </url>\n`;
  });

  sitemapXML += `</urlset>`;

  res.header("Content-Type", "application/xml");
  res.send(sitemapXML);
});

app.get("/sitemap/:category.xml", async (req, res) => {
  try {
    const { category } = req.params;
    const categorySql = "SELECT cat_id FROM category_url WHERE url_name = ? AND status = 1";
    const [categoryData] = await db.promise().query(categorySql, [category]);

    if (categoryData.length === 0) {
      return res.status(404).send("Category not found");
    }

    const catId = categoryData[0].cat_id;
    const productSql = "SELECT id, slug FROM products WHERE cat_id = ?";
    const [products] = await db.promise().query(productSql, [catId]);

    if (products.length === 0) {
      return res.status(404).send("No products found in this category");
    }

    let sitemapXML = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    sitemapXML += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    products.forEach((product) => {
      sitemapXML += `  <url>\n`;
      sitemapXML += `    <loc>https://sriina.com/${product?.slug}/${product?.id}</loc>\n`;
      sitemapXML += `    <lastmod>2025-08-20</lastmod>\n`;
      sitemapXML += `    <changefreq>weekly</changefreq>\n`;
      sitemapXML += `    <priority>0.7</priority>\n`;
      sitemapXML += `  </url>\n`;
    });

    sitemapXML += `</urlset>`;

    res.header("Content-Type", "application/xml");
    res.send(sitemapXML);
  } catch (err) {
    console.error("❌ Error:", err);
    res.status(500).send("Error generating sitemap.");
  }
});

app.get("/:slug/:id", csrfProtection, product.viewProduct);

app.get("/:id", pages.getCategories);
// Middleware
app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
