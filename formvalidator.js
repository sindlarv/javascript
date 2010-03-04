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
    return ("\"" + fname + "\": nespr�vn� form�t, vy�aduje p�esn� " + minDigits + " ��slic\n");
    }
    else
    {
    return ("\"" + fname + "\": nespr�vn� form�t, vy�aduje min. " + minDigits + " a max. " + maxDigits + " ��slic\n");
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
     return ("\"" + fname + "\": nespr�vn� form�t, vy�aduje ��slo od " + minVal + " do " + maxVal + "\n");
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
    return ("\"" + fname + "\": nespr�vn� form�t, vy�aduje min. " + minDigits + " ��slic\n");
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
    return ("\"" + fname + "\": nespr�vn� form�t\n");
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
     return ("\"" + fname + "\": pole nen� vypln�no\n");
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
  var alert_prefix = "Ve formul��i se vyskytly tyto probl�my:\n";
  if (obj.name=="registrace")
  {
    alert_message = validate_required(obj.username, "U�ivatelsk� jm�no") + validate_required(obj.nickname, "P�ezd�vka") + validate_required(obj.email, "E-mail") + validate_email(obj.email, "E-mail") + validate_required(obj.password, "Heslo");
  }; 
  if (obj.name=="sipo")
  {
    alert_message = validate_required(obj.prijmeni, "P��jmen�") + validate_required(obj.jmeno, "Jm�no") + validate_required(obj.narozeni_rok, "Datum narozen�") + validate_required(obj.ulice, "Ulice") + validate_required(obj.cislo_popisne, "��slo popisn�") + validate_required(obj.obec, "Obec") + validate_required(obj.psc, "PS� pro adresu trval�ho pobytu") + validate_numbers(obj.psc, 5, 5, "PS� pro adresu trval�ho pobytu") + validate_numbers(obj.ku_psc, 5, 5, "PS� pro kontaktn� �daje") + validate_required(obj.ku_email, "E-mail") + validate_email(obj.ku_email, "E-mail");
  };
  if (obj.name=="smlouva")
  {
    alert_message = validate_required(obj.obchodni_nazev, "P�esn� obchodn� n�zev") + validate_required(obj.ic, "I�") + validate_numbers(obj.ic, 8, 8, "I�") + validate_required(obj.dic, "DI�") + validate_required(obj.ulice, "Ulice") + validate_required(obj.cislo_popisne, "��slo popisn�") + validate_required(obj.obec, "Obec") + validate_required(obj.psc, "PS�") + validate_numbers(obj.psc, 5, 5, "PS�") + validate_required(obj.prijmeni, "P��jmen�") + validate_required(obj.jmeno, "Jm�no") + validate_required(obj.telefon, "Telefon") + validate_phone(obj.telefon, "Telefon") + validate_required(obj.email, "E-mail") + validate_email(obj.email, "E-mail");
  };

// ukazka kontroly velmi komplexniho formulare pro zaslani zadosti o SIPO
  if (obj.name=="sipo_kontakt")
  {

// Odd�l 1 pro PO
    if (document.getElementById("zakaznik_po").checked == true)
    {
        alert_message = alert_message + validate_required(document.getElementById("f-nazev"), "Obchodn� firma / n�zev") + validate_required(document.getElementById("f-ulice"),"S�dlo - Ulice") + validate_required(document.getElementById("f-cpopisne"), "S�dlo - ��slo popisn�") + validate_required(document.getElementById("f-obec"), "S�dlo - Obec") +  validate_required(document.getElementById("f-psc"), "S�dlo - PS�") + validate_numbers(document.getElementById("f-psc"), 5, 5, "S�dlo - PS�") + validate_numbers(document.getElementById("f-psc-k"), 5, 5, "Koresponden�n� - PS�") + validate_required(document.getElementById("f-jmeno"),"Opr�vn�n� osoba - Jm�no") + validate_required(document.getElementById("f-prijmeni"), "Opr�vn�n� osoba - P��jmen�") + validate_required(document.getElementById("f-funkce"), "Opr�vn�n� osoba - Funkce") + validate_required(document.getElementById("f-ic"), "I�") + validate_numbers(document.getElementById("f-ic"), 8, 8,"I�");
    }
// Odd�l 1 pro OSVC
    if (document.getElementById("zakaznik_osvc").checked == true)
    {
        alert_message = alert_message + validate_required(document.getElementById("f-jmeno-3"), "Jm�no") + validate_required(document.getElementById("f-prijmeni-3"), "P��jmen�") + validate_required(document.getElementById("f-ulice-3"),"M�sto podnik�n� - Ulice") + validate_required(document.getElementById("f-cpopisne-3"), "M�sto podnik�n� - ��slo popisn�") + validate_required(document.getElementById("f-obec-3"), "M�sto podnik�n� - Obec") + validate_required(document.getElementById("f-psc-3"), "M�sto podnik�n� - PS�") + validate_numbers(document.getElementById("f-psc-3"), 5, 5, "M�sto podn�k�n� - PS�") + validate_numbers(document.getElementById("f-psc-3-k"), 5, 5, "Koresponden�n� - PS�") + validate_required(document.getElementById("f-ic-3"), "I�")  + validate_numbers(document.getElementById("f-ic-3"), 8, 8,"I�");
    }

// Odd�l 1 pro FO
    if (document.getElementById("zakaznik_fo").checked == true)
    {
        alert_message = alert_message + validate_required(document.getElementById("f-jmeno-4"), "Jm�no") + validate_required(document.getElementById("f-prijmeni-4"), "P��jmen�") + validate_required(document.getElementById("f-ulice-4"),"Adresa trval�ho pobytu - Ulice") + validate_required(document.getElementById("f-cpopisne-4"), "Adresa trval�ho pobytu - ��slo popisn�") + validate_required(document.getElementById("f-obec-4"), "Adresa trval�ho pobytu - Obec") + validate_required(document.getElementById("f-psc-4"), "Adresa trval�ho pobytu - PS�") +  validate_numbers(document.getElementById("f-psc-4"), 5, 5, "M�sto podn�k�n� - PS�") + validate_numbers(document.getElementById("f-psc-4-k"), 5, 5, "Koresponden�n� - PS�") + validate_required(document.getElementById("f-den-4"), "Narozen� - Den") + validate_numvalue(document.getElementById("f-den-4"), 1, 31, "Narozen� - Den") + validate_required(document.getElementById("f-mesic-4"), "Narozen� - M�s�c") + validate_numvalue(document.getElementById("f-mesic-4"), 1, 12, "Narozen� - M�s�c") + validate_required(document.getElementById("f-rok-4"), "Narozen� - Rok") + validate_numbers(document.getElementById("f-rok-4"), 4, 4, "Narozen� - Rok") + validate_required(document.getElementById("f-misto-4"), "Narozen� - M�sto")  ;
     }

// Jeden ��et
    if (document.getElementById("ucetJeden").checked == true)
    {
        alert_message = alert_message + validate_required(document.getElementById("f-cu"), "��slo ��tu") + validate_numbers(document.getElementById("f-vs"), 1, 10, "Variabiln� symbol") + validate_numbers(document.getElementById("f-ss"), 1, 10, "Specifick� symbol");
     }

// V�ce ��t�
    if (document.getElementById("ucetVice").checked == true)
    {
      //alert_message = alert_message + validate_required(document.getElementById("f-cu-0"), "��slo v�choz�ho ��tu") + validate_numbers(document.getElementById("f-vs-0"), 1, 10, "V�choz� ��et - Variabiln� symbol") + validate_numbers(document.getElementById("f-ss-0"), 1, 10, "V�choz� ��et - Specifick� symbol") + validate_numbers(document.getElementById("f-vs-1"), 1, 10, "Dal�� ��et �. 1 - Variabiln� symbol") + validate_numbers(document.getElementById("f-ss-1"), 1, 10, "Dal�� ��et �. 1 - Specifick� symbol") + validate_numbers(document.getElementById("f-vs-2"), 1, 10, "Dal�� ��et �. 2 - Variabiln� symbol") + validate_numbers(document.getElementById("f-ss-2"), 1, 10, "Dal�� ��et �. 2 - Specifick� symbol") + validate_numbers(document.getElementById("f-vs-3"), 1, 10, "Dal�� ��et �. 3 - Variabiln� symbol") + validate_numbers(document.getElementById("f-ss-3"), 1, 10, "Dal�� ��et �. 3 - Specifick� symbol") + validate_numbers(document.getElementById("f-vs-4"), 1, 10, "Dal�� ��et �. 4 - Variabiln� symbol") + validate_numbers(document.getElementById("f-ss-4"), 1, 10, "Dal�� ��et �. 4 - Specifick� symbol") + validate_numbers(document.getElementById("f-vs-5"), 1, 10, "Dal�� ��et �. 5 - Variabiln� symbol") + validate_numbers(document.getElementById("f-ss-5"), 1, 10, "Dal�� ��et �. 5 - Specifick� symbol");
      alert_message = alert_message + validate_required(document.getElementById("f-cu-0"), "��slo v�choz�ho ��tu") + validate_numbers(document.getElementById("f-vs-0"), 1, 10, "V�choz� ��et - Variabiln� symbol") + validate_numbers(document.getElementById("f-ss-0"), 1, 10, "V�choz� ��et - Specifick� symbol") + validate_numbers(document.getElementById("f-vs-1"), 1, 10, "Dal�� ��et �. 1 - Variabiln� symbol") + validate_numbers(document.getElementById("f-ss-1"), 1, 10, "Dal�� ��et �. 1 - Specifick� symbol");
      if (document.getElementById("f-cu-2")) {
        alert_message = alert_message + validate_numbers(document.getElementById("f-vs-2"), 1, 10, "Dal�� ��et �. 2 - Variabiln� symbol") + validate_numbers(document.getElementById("f-ss-2"), 1, 10, "Dal�� ��et �. 2 - Specifick� symbol");
      }
      if (document.getElementById("f-cu-3")) {
        alert_message = alert_message + validate_numbers(document.getElementById("f-vs-3"), 1, 10, "Dal�� ��et �. 3 - Variabiln� symbol") + validate_numbers(document.getElementById("f-ss-3"), 1, 10, "Dal�� ��et �. 3 - Specifick� symbol");
      }
      if (document.getElementById("f-cu-4")) {
        alert_message = alert_message + validate_numbers(document.getElementById("f-vs-4"), 1, 10, "Dal�� ��et �. 4 - Variabiln� symbol") + validate_numbers(document.getElementById("f-ss-4"), 1, 10, "Dal�� ��et �. 4 - Specifick� symbol");
      }
      if (document.getElementById("f-cu-5")) {
        alert_message = alert_message + validate_numbers(document.getElementById("f-vs-5"), 1, 10, "Dal�� ��et �. 5 - Variabiln� symbol") + validate_numbers(document.getElementById("f-ss-5"), 1, 10, "Dal�� ��et �. 5 - Specifick� symbol");
      }
    }

// Zmocneni
if (document.getElementById("zmocneni_zastupce").checked == true)
{

// Odd�l 3 pro PO (Zmocneni)
    if (document.getElementById("zmocneni_po").checked == true)
    {
        alert_message = alert_message + validate_required(document.getElementById("f-nazev-5"), "Zmocn�n� - Obchodn� firma / n�zev") + validate_required(document.getElementById("f-ulice-5"),"Zmocn�n� - S�dlo - Ulice") + validate_required(document.getElementById("f-cpopisne-5"), "Zmocn�n� - S�dlo - ��slo popisn�") + validate_required(document.getElementById("f-obec-5"), "Zmocn�n� - S�dlo - Obec") + validate_required(document.getElementById("f-psc-5"), "Zmocn�n� - S�dlo - PS�") + validate_numbers(document.getElementById("f-psc-5"),5,5,"Zmocn�n� - S�dlo - PS�") + validate_numbers(document.getElementById("f-psc-5-k"),5,5,"Zmocn�n� - Koresponden�n� - PS�") + validate_required(document.getElementById("f-jmeno-5"),"Zmocn�n� - Opr�vn�n� osoba - Jm�no") + validate_required(document.getElementById("f-prijmeni-5"), "Zmocn�n� - Opr�vn�n� osoba - P��jmen�") + validate_required(document.getElementById("f-funkce-5"), "Zmocn�n� - Opr�vn�n� osoba - Funkce") + validate_required(document.getElementById("f-ic-5"), "Zmocn�n� - I�") +  validate_numbers(document.getElementById("f-ic-5"),8,8,"Zmocn�n� - I�");
    }

// Odd�l 3 pro OSVC (Zmocneni)
    if (document.getElementById("zmocneni_osvc").checked == true)
    {
        alert_message = alert_message + validate_required(document.getElementById("f-jmeno-6"), "Zmocn�n� - Jm�no") + validate_required(document.getElementById("f-prijmeni-6"), "Zmocn�n� - P��jmen�") + validate_required(document.getElementById("f-ulice-6"),"Zmocn�n� - M�sto podnik�n� - Ulice") + validate_required(document.getElementById("f-cpopisne-6"), "Zmocn�n� - M�sto podnik�n� - ��slo popisn�") + validate_required(document.getElementById("f-obec-6"), "Zmocn�n� - M�sto podnik�n� - Obec") + validate_required(document.getElementById("f-psc-6"), "Zmocn�n� - M�sto podnik�n� - PS�") + validate_numbers(document.getElementById("f-psc-6"),5,5,"Zmocn�n� - M�sto podnik�n� - PS�") + validate_numbers(document.getElementById("f-psc-6-k"),5,5,"Zmocn�n� - Koresponden�n� - PS�") + validate_required(document.getElementById("f-ic-6"), "Zmocn�n� - I�") + validate_numbers(document.getElementById("f-ic-6"),8,8,"Zmocn�n� - I�");
    }

// Odd�l 3 pro FO (Zmocneni)
    if (document.getElementById("zmocneni_fo").checked == true)
    {
        alert_message = alert_message + validate_required(document.getElementById("f-jmeno-7"), "Zmocn�n� - Jm�no") + validate_required(document.getElementById("f-prijmeni-7"), "Zmocn�n� - P��jmen�") + validate_required(document.getElementById("f-ulice-7"),"Zmocn�n� - Adresa trval�ho pobytu - Ulice") + validate_required(document.getElementById("f-cpopisne-7"), "Zmocn�n� - Adresa trval�ho pobytu - ��slo popisn�") + validate_required(document.getElementById("f-obec-7"), "Zmocn�n� - Adresa trval�ho pobytu - Obec") + validate_required(document.getElementById("f-psc-7"), "Zmocn�n� - Adresa trval�ho pobytu - PS�") + validate_numbers(document.getElementById("f-psc-7"),5,5,"Zmocn�n� - Adresa trval�ho pobytu - PS�") + validate_numbers(document.getElementById("f-psc-7-k"),5,5,"Zmocn�n� - Koresponden�n� - PS�") + validate_required(document.getElementById("f-den-7"), "Zmocn�n� - Narozen� - Den") + validate_numvalue(document.getElementById("f-den-7"),1,31,"Zmocn�n� - Narozen� - Den") + validate_required(document.getElementById("f-mesic-7"), "Zmocn�n� - Narozen� - M�s�c") + validate_numvalue(document.getElementById("f-mesic-7"),1,12,"Zmocn�n� - Narozen� - M�s�c") + validate_required(document.getElementById("f-rok-7"), "Zmocn�n� - Narozen� - Rok") + validate_numbers(document.getElementById("f-rok-7"),4,4,"Zmocn�n� - Narozen� - Rok") + validate_required(document.getElementById("f-misto-7"), "Zmocn�n� - Narozen� - M�sto")  ;
     }
}

// Kontaktn� osoba
      alert_message = alert_message + validate_required(document.getElementById("f-jmeno-8"), "Kontaktn� osoba - Jm�no") + validate_required(document.getElementById("f-prijmeni-8"), "Kontaktn� osoba - P��jmen�") + validate_required(document.getElementById("f-telefon-8"), "Kontaktn� osoba - Telefon") + validate_phone(document.getElementById("f-telefon-8"), "Kontaktn� osoba - Telefon") + validate_required(document.getElementById("f-email-8"), "Kontaktn� osoba - E-mail") + validate_email(document.getElementById("f-email-8"), "Kontaktn� osoba - E-mail");

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
