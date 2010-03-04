//z retezce (mystring) odstrani definovane znaky (pole validchars)
function trimChars(mystring, validchars)
{
  var i;
  var returnstring = "";

  for (i = 0; i < mystring.length; i++)
  {
    var c = mystring.charAt(i);
    if (validchars.indexOf(c) == -1) returnstring += c;
  }
  return returnstring;
}

//overi platnost cisla (nvalue) a minimalni (mindigits) s maximalnim (maxdigits) poctem cislic
function validate_numbers(nvalue, mindigits, maxdigits, fname)
{
  var mySwitch=1
  var strNumber = nvalue.value
  var minDigits = mindigits;
  var maxDigits = maxdigits;

  strNumber = trimChars(strNumber," ");
  //return strPhone;
  if (isNaN(strNumber)) mySwitch = 0;
  if ((strNumber.length < minDigits || strNumber.length > maxDigits) && strNumber.length != 0) mySwitch = 0;
  
  if (mySwitch == 0)
  {
    if (minDigits == maxDigits)
    {
    return ("\"" + fname + "\": nesprávný formát, vyžaduje pøesnì " + minDigits + " èíslic\n");
    }
    else
    {
    return ("\"" + fname + "\": nesprávný formát, vyžaduje min. " + minDigits + " a max. " + maxDigits + " èíslic\n");
    }
  }
  {
    return ("");
  }
}

//overi platnost cisla (nvalue) a minimalni (minval) s maximalni (maxval) hodnotou
function validate_numvalue(nvalue, minval, maxval, fname)
{
  var mySwitch=1
  var strNumber = nvalue.value
  var minVal = minval;
  var maxVal = maxval;

  strNumber = trimChars(strNumber," ");
  //return strPhone;
  if (isNaN(strNumber)) mySwitch = 0;
  var numVal = parseInt(strNumber);
  if ((numVal < minVal) || (numVal > maxVal)) mySwitch = 0;
  
  if (mySwitch == 0)
  {
     return ("\"" + fname + "\": nesprávný formát, vyžaduje èíslo od " + minVal + " do " + maxVal + "\n");
  }
  else
  {
    return ("");
  }
}

//overi platnost telefonniho cisla (phone)
function validate_phone(phone, fname)
{
  var phoneNumberDelimiters = "()- ";
  var validPhoneChars = phoneNumberDelimiters + "+";
  var minDigits = 9;
  var mySwitch=1
  var strPhone = phone.value

  strPhone = trimChars(strPhone," ");
  //return strPhone;
  if (strPhone.indexOf("+") > 0) mySwitch = 0;

  strPhone = trimChars(strPhone,validPhoneChars);
  //return strPhone;
  if (isNaN(strPhone)) mySwitch = 0;
  if (strPhone.length > 0 && strPhone.length < minDigits) mySwitch = 0;
  
  if (mySwitch == 0)
  {
    return ("\"" + fname + "\": nesprávný formát, vyžaduje min. " + minDigits + " èíslic\n");
  }
  {
    return ("");
  }
}

//overi platnost emailu (email)
function validate_email(email, fname)
{
  re = /^[^.]+(\.[^.]+)*@([^.]+[.])+[a-z]{2,4}$/;
  if (email.value.search(re) != 0 && email.value!=0)
  {
    return ("\"" + fname + "\": nesprávný formát\n");
  }
  else
  {
    return ("");
  }
}

//overi, zda uzivatel zadal udaje do povinneho pole (field)
function validate_required(field, fname)
{
  if (field.value == "")
  {
     return ("\"" + fname + "\": pole není vyplnìno\n");
   }
   else
   {
      return ("");
    }
}

//nasleduje samotna validacni funkce, vyvolavana pri onsubmit()
//uvedeny priklad je redukovana implementace ze sipo.cz, kde ...
// - kazdy formular stranek ma svou vlastni sekci
// - vypis jednotlivych polozek je realizovan stylem postupne jeden za druhym
function validate_form(obj)
{
  var alert_message = "";
  var alert_prefix = "Ve formuláøi se vyskytly tyto problémy:\n";
  if (obj.name=="registrace")
  {
    alert_message = validate_required(obj.username, "Uživatelské jméno") + validate_required(obj.nickname, "Pøezdívka") + validate_required(obj.email, "E-mail") + validate_email(obj.email, "E-mail") + validate_required(obj.password, "Heslo");
  }; 
  if (obj.name=="sipo")
  {
    alert_message = validate_required(obj.prijmeni, "Pøíjmení") + validate_required(obj.jmeno, "Jméno") + validate_required(obj.narozeni_rok, "Datum narození") + validate_required(obj.ulice, "Ulice") + validate_required(obj.cislo_popisne, "Èíslo popisné") + validate_required(obj.obec, "Obec") + validate_required(obj.psc, "PSÈ pro adresu trvalého pobytu") + validate_numbers(obj.psc, 5, 5, "PSÈ pro adresu trvalého pobytu") + validate_numbers(obj.ku_psc, 5, 5, "PSÈ pro kontaktní údaje") + validate_required(obj.ku_email, "E-mail") + validate_email(obj.ku_email, "E-mail");
  };
  if (obj.name=="smlouva")
  {
    alert_message = validate_required(obj.obchodni_nazev, "Pøesný obchodní název") + validate_required(obj.ic, "IÈ") + validate_numbers(obj.ic, 8, 8, "IÈ") + validate_required(obj.dic, "DIÈ") + validate_required(obj.ulice, "Ulice") + validate_required(obj.cislo_popisne, "Èíslo popisné") + validate_required(obj.obec, "Obec") + validate_required(obj.psc, "PSÈ") + validate_numbers(obj.psc, 5, 5, "PSÈ") + validate_required(obj.prijmeni, "Pøíjmení") + validate_required(obj.jmeno, "Jméno") + validate_required(obj.telefon, "Telefon") + validate_phone(obj.telefon, "Telefon") + validate_required(obj.email, "E-mail") + validate_email(obj.email, "E-mail");
  };

// ukazka kontroly velmi komplexniho formulare pro zaslani zadosti o SIPO
  if (obj.name=="sipo_kontakt")
  {

// Oddíl 1 pro PO
    if (document.getElementById("zakaznik_po").checked == true)
    {
        alert_message = alert_message + validate_required(document.getElementById("f-nazev"), "Obchodní firma / název") + validate_required(document.getElementById("f-ulice"),"Sídlo - Ulice") + validate_required(document.getElementById("f-cpopisne"), "Sídlo - Èíslo popisné") + validate_required(document.getElementById("f-obec"), "Sídlo - Obec") +  validate_required(document.getElementById("f-psc"), "Sídlo - PSÈ") + validate_numbers(document.getElementById("f-psc"), 5, 5, "Sídlo - PSÈ") + validate_numbers(document.getElementById("f-psc-k"), 5, 5, "Korespondenèní - PSÈ") + validate_required(document.getElementById("f-jmeno"),"Oprávnìná osoba - Jméno") + validate_required(document.getElementById("f-prijmeni"), "Oprávnìná osoba - Pøíjmení") + validate_required(document.getElementById("f-funkce"), "Oprávnìná osoba - Funkce") + validate_required(document.getElementById("f-ic"), "IÈ") + validate_numbers(document.getElementById("f-ic"), 8, 8,"IÈ");
    }
// Oddíl 1 pro OSVC
    if (document.getElementById("zakaznik_osvc").checked == true)
    {
        alert_message = alert_message + validate_required(document.getElementById("f-jmeno-3"), "Jméno") + validate_required(document.getElementById("f-prijmeni-3"), "Pøíjmení") + validate_required(document.getElementById("f-ulice-3"),"Místo podnikání - Ulice") + validate_required(document.getElementById("f-cpopisne-3"), "Místo podnikání - Èíslo popisné") + validate_required(document.getElementById("f-obec-3"), "Místo podnikání - Obec") + validate_required(document.getElementById("f-psc-3"), "Místo podnikání - PSÈ") + validate_numbers(document.getElementById("f-psc-3"), 5, 5, "Místo podníkání - PSÈ") + validate_numbers(document.getElementById("f-psc-3-k"), 5, 5, "Korespondenèní - PSÈ") + validate_required(document.getElementById("f-ic-3"), "IÈ")  + validate_numbers(document.getElementById("f-ic-3"), 8, 8,"IÈ");
    }

// Oddíl 1 pro FO
    if (document.getElementById("zakaznik_fo").checked == true)
    {
        alert_message = alert_message + validate_required(document.getElementById("f-jmeno-4"), "Jméno") + validate_required(document.getElementById("f-prijmeni-4"), "Pøíjmení") + validate_required(document.getElementById("f-ulice-4"),"Adresa trvalého pobytu - Ulice") + validate_required(document.getElementById("f-cpopisne-4"), "Adresa trvalého pobytu - Èíslo popisné") + validate_required(document.getElementById("f-obec-4"), "Adresa trvalého pobytu - Obec") + validate_required(document.getElementById("f-psc-4"), "Adresa trvalého pobytu - PSÈ") +  validate_numbers(document.getElementById("f-psc-4"), 5, 5, "Místo podníkání - PSÈ") + validate_numbers(document.getElementById("f-psc-4-k"), 5, 5, "Korespondenèní - PSÈ") + validate_required(document.getElementById("f-den-4"), "Narození - Den") + validate_numvalue(document.getElementById("f-den-4"), 1, 31, "Narození - Den") + validate_required(document.getElementById("f-mesic-4"), "Narození - Mìsíc") + validate_numvalue(document.getElementById("f-mesic-4"), 1, 12, "Narození - Mìsíc") + validate_required(document.getElementById("f-rok-4"), "Narození - Rok") + validate_numbers(document.getElementById("f-rok-4"), 4, 4, "Narození - Rok") + validate_required(document.getElementById("f-misto-4"), "Narození - Místo")  ;
     }

// Jeden úèet
    if (document.getElementById("ucetJeden").checked == true)
    {
        alert_message = alert_message + validate_required(document.getElementById("f-cu"), "Èíslo úètu") + validate_numbers(document.getElementById("f-vs"), 1, 10, "Variabilní symbol") + validate_numbers(document.getElementById("f-ss"), 1, 10, "Specifický symbol");
     }

// Více úètù
    if (document.getElementById("ucetVice").checked == true)
    {
      //alert_message = alert_message + validate_required(document.getElementById("f-cu-0"), "Èíslo výchozího úètu") + validate_numbers(document.getElementById("f-vs-0"), 1, 10, "Výchozí úèet - Variabilní symbol") + validate_numbers(document.getElementById("f-ss-0"), 1, 10, "Výchozí úèet - Specifický symbol") + validate_numbers(document.getElementById("f-vs-1"), 1, 10, "Další úèet è. 1 - Variabilní symbol") + validate_numbers(document.getElementById("f-ss-1"), 1, 10, "Další úèet è. 1 - Specifický symbol") + validate_numbers(document.getElementById("f-vs-2"), 1, 10, "Další úèet è. 2 - Variabilní symbol") + validate_numbers(document.getElementById("f-ss-2"), 1, 10, "Další úèet è. 2 - Specifický symbol") + validate_numbers(document.getElementById("f-vs-3"), 1, 10, "Další úèet è. 3 - Variabilní symbol") + validate_numbers(document.getElementById("f-ss-3"), 1, 10, "Další úèet è. 3 - Specifický symbol") + validate_numbers(document.getElementById("f-vs-4"), 1, 10, "Další úèet è. 4 - Variabilní symbol") + validate_numbers(document.getElementById("f-ss-4"), 1, 10, "Další úèet è. 4 - Specifický symbol") + validate_numbers(document.getElementById("f-vs-5"), 1, 10, "Další úèet è. 5 - Variabilní symbol") + validate_numbers(document.getElementById("f-ss-5"), 1, 10, "Další úèet è. 5 - Specifický symbol");
      alert_message = alert_message + validate_required(document.getElementById("f-cu-0"), "Èíslo výchozího úètu") + validate_numbers(document.getElementById("f-vs-0"), 1, 10, "Výchozí úèet - Variabilní symbol") + validate_numbers(document.getElementById("f-ss-0"), 1, 10, "Výchozí úèet - Specifický symbol") + validate_numbers(document.getElementById("f-vs-1"), 1, 10, "Další úèet è. 1 - Variabilní symbol") + validate_numbers(document.getElementById("f-ss-1"), 1, 10, "Další úèet è. 1 - Specifický symbol");
      if (document.getElementById("f-cu-2")) {
        alert_message = alert_message + validate_numbers(document.getElementById("f-vs-2"), 1, 10, "Další úèet è. 2 - Variabilní symbol") + validate_numbers(document.getElementById("f-ss-2"), 1, 10, "Další úèet è. 2 - Specifický symbol");
      }
      if (document.getElementById("f-cu-3")) {
        alert_message = alert_message + validate_numbers(document.getElementById("f-vs-3"), 1, 10, "Další úèet è. 3 - Variabilní symbol") + validate_numbers(document.getElementById("f-ss-3"), 1, 10, "Další úèet è. 3 - Specifický symbol");
      }
      if (document.getElementById("f-cu-4")) {
        alert_message = alert_message + validate_numbers(document.getElementById("f-vs-4"), 1, 10, "Další úèet è. 4 - Variabilní symbol") + validate_numbers(document.getElementById("f-ss-4"), 1, 10, "Další úèet è. 4 - Specifický symbol");
      }
      if (document.getElementById("f-cu-5")) {
        alert_message = alert_message + validate_numbers(document.getElementById("f-vs-5"), 1, 10, "Další úèet è. 5 - Variabilní symbol") + validate_numbers(document.getElementById("f-ss-5"), 1, 10, "Další úèet è. 5 - Specifický symbol");
      }
    }

// Zmocneni
if (document.getElementById("zmocneni_zastupce").checked == true)
{

// Oddíl 3 pro PO (Zmocneni)
    if (document.getElementById("zmocneni_po").checked == true)
    {
        alert_message = alert_message + validate_required(document.getElementById("f-nazev-5"), "Zmocnìní - Obchodní firma / název") + validate_required(document.getElementById("f-ulice-5"),"Zmocnìní - Sídlo - Ulice") + validate_required(document.getElementById("f-cpopisne-5"), "Zmocnìní - Sídlo - Èíslo popisné") + validate_required(document.getElementById("f-obec-5"), "Zmocnìní - Sídlo - Obec") + validate_required(document.getElementById("f-psc-5"), "Zmocnìní - Sídlo - PSÈ") + validate_numbers(document.getElementById("f-psc-5"),5,5,"Zmocnìní - Sídlo - PSÈ") + validate_numbers(document.getElementById("f-psc-5-k"),5,5,"Zmocnìní - Korespondenèní - PSÈ") + validate_required(document.getElementById("f-jmeno-5"),"Zmocnìní - Oprávnìná osoba - Jméno") + validate_required(document.getElementById("f-prijmeni-5"), "Zmocnìní - Oprávnìná osoba - Pøíjmení") + validate_required(document.getElementById("f-funkce-5"), "Zmocnìní - Oprávnìná osoba - Funkce") + validate_required(document.getElementById("f-ic-5"), "Zmocnìní - IÈ") +  validate_numbers(document.getElementById("f-ic-5"),8,8,"Zmocnìní - IÈ");
    }

// Oddíl 3 pro OSVC (Zmocneni)
    if (document.getElementById("zmocneni_osvc").checked == true)
    {
        alert_message = alert_message + validate_required(document.getElementById("f-jmeno-6"), "Zmocnìní - Jméno") + validate_required(document.getElementById("f-prijmeni-6"), "Zmocnìní - Pøíjmení") + validate_required(document.getElementById("f-ulice-6"),"Zmocnìní - Místo podnikání - Ulice") + validate_required(document.getElementById("f-cpopisne-6"), "Zmocnìní - Místo podnikání - Èíslo popisné") + validate_required(document.getElementById("f-obec-6"), "Zmocnìní - Místo podnikání - Obec") + validate_required(document.getElementById("f-psc-6"), "Zmocnìní - Místo podnikání - PSÈ") + validate_numbers(document.getElementById("f-psc-6"),5,5,"Zmocnìní - Místo podnikání - PSÈ") + validate_numbers(document.getElementById("f-psc-6-k"),5,5,"Zmocnìní - Korespondenèní - PSÈ") + validate_required(document.getElementById("f-ic-6"), "Zmocnìní - IÈ") + validate_numbers(document.getElementById("f-ic-6"),8,8,"Zmocnìní - IÈ");
    }

// Oddíl 3 pro FO (Zmocneni)
    if (document.getElementById("zmocneni_fo").checked == true)
    {
        alert_message = alert_message + validate_required(document.getElementById("f-jmeno-7"), "Zmocnìní - Jméno") + validate_required(document.getElementById("f-prijmeni-7"), "Zmocnìní - Pøíjmení") + validate_required(document.getElementById("f-ulice-7"),"Zmocnìní - Adresa trvalého pobytu - Ulice") + validate_required(document.getElementById("f-cpopisne-7"), "Zmocnìní - Adresa trvalého pobytu - Èíslo popisné") + validate_required(document.getElementById("f-obec-7"), "Zmocnìní - Adresa trvalého pobytu - Obec") + validate_required(document.getElementById("f-psc-7"), "Zmocnìní - Adresa trvalého pobytu - PSÈ") + validate_numbers(document.getElementById("f-psc-7"),5,5,"Zmocnìní - Adresa trvalého pobytu - PSÈ") + validate_numbers(document.getElementById("f-psc-7-k"),5,5,"Zmocnìní - Korespondenèní - PSÈ") + validate_required(document.getElementById("f-den-7"), "Zmocnìní - Narození - Den") + validate_numvalue(document.getElementById("f-den-7"),1,31,"Zmocnìní - Narození - Den") + validate_required(document.getElementById("f-mesic-7"), "Zmocnìní - Narození - Mìsíc") + validate_numvalue(document.getElementById("f-mesic-7"),1,12,"Zmocnìní - Narození - Mìsíc") + validate_required(document.getElementById("f-rok-7"), "Zmocnìní - Narození - Rok") + validate_numbers(document.getElementById("f-rok-7"),4,4,"Zmocnìní - Narození - Rok") + validate_required(document.getElementById("f-misto-7"), "Zmocnìní - Narození - Místo")  ;
     }
}

// Kontaktní osoba
      alert_message = alert_message + validate_required(document.getElementById("f-jmeno-8"), "Kontaktní osoba - Jméno") + validate_required(document.getElementById("f-prijmeni-8"), "Kontaktní osoba - Pøíjmení") + validate_required(document.getElementById("f-telefon-8"), "Kontaktní osoba - Telefon") + validate_phone(document.getElementById("f-telefon-8"), "Kontaktní osoba - Telefon") + validate_required(document.getElementById("f-email-8"), "Kontaktní osoba - E-mail") + validate_email(document.getElementById("f-email-8"), "Kontaktní osoba - E-mail");

  };


  if (alert_message != "")
  {
    alert(alert_prefix + alert_message);
    return (false);
  }
  else
  {
    return (true);
  };
}
