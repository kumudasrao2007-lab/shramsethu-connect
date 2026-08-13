/**
 * Curated Health schemes for gig / unorganised workers.
 * All content sourced from official Government of India programme pages.
 */
export type HealthScheme = {
  slug: string;
  name: string;
  shortName: string;
  authority: string;
  summary: string;
  description: string;
  purpose: string;
  eligibility: string[];
  benefits: string[];
  documents: string[];
  process: string[];
  url: string;
};

export const HEALTH_SCHEMES: HealthScheme[] = [
  {
    slug: "abha",
    name: "Ayushman Bharat Health Account (ABHA)",
    shortName: "ABHA",
    authority: "National Health Authority, Ministry of Health & Family Welfare",
    summary: "A free 14-digit health ID that links and stores your medical records digitally.",
    description:
      "ABHA is a unique 14-digit health account number created under the Ayushman Bharat Digital Mission (ABDM). It lets you link, store and share your health records — prescriptions, lab reports, discharge summaries and vaccination records — with any ABDM-registered hospital, clinic or lab, with your consent.",
    purpose:
      "To give every citizen a portable, consent-based digital health record so care can continue seamlessly across cities, employers and hospitals — especially useful for gig workers, drivers and migrant workers who move frequently.",
    eligibility: [
      "Any Indian resident of any age can create an ABHA number",
      "No income, employment or occupation condition",
      "Requires an Aadhaar number or a driving licence for identity verification",
      "A mobile number linked for OTP verification",
    ],
    benefits: [
      "Free to create; valid for life and usable across India",
      "Single digital repository of prescriptions, lab reports and hospital records",
      "Consent-based sharing — you control who can view your records",
      "Removes the need to carry physical files to every hospital visit",
      "Links with the ABHA mobile app (ABHA / ABDM ecosystem apps) for easy access",
    ],
    documents: [
      "Aadhaar number (or driving licence)",
      "Mobile number linked to Aadhaar for OTP",
    ],
    process: [
      "Visit abha.abdm.gov.in and choose 'Create ABHA number'",
      "Select Aadhaar or driving licence as the identity document",
      "Enter the number and verify the OTP sent to your mobile",
      "Set your ABHA address (e.g. yourname@abdm) and complete profile details",
      "Download your ABHA card — it can also be shown at any ABDM-linked facility",
    ],
    url: "https://abha.abdm.gov.in/abha/v3/",
  },
  {
    slug: "pmbjp",
    name: "Pradhan Mantri Bhartiya Janaushadhi Pariyojana (PMBJP)",
    shortName: "PMBJP",
    authority: "Pharmaceuticals & Medical Devices Bureau of India (PMBI), Department of Pharmaceuticals",
    summary: "Quality generic medicines at sharply lower prices through Janaushadhi Kendras.",
    description:
      "PMBJP makes quality generic medicines available at affordable prices through a nationwide network of dedicated Jan Aushadhi Kendras. The medicines are procured from WHO-GMP certified suppliers and are typically priced far below equivalent branded products.",
    purpose:
      "To reduce out-of-pocket medicine spending for low and irregular-income households, including gig and daily-wage workers, and to raise awareness that generic medicines are equally effective.",
    eligibility: [
      "Open to every citizen — anyone can buy medicines at a Jan Aushadhi Kendra",
      "No registration, income limit or card required to purchase",
      "For opening a Kendra: individuals with a D.Pharma/B.Pharma degree, or an NGO/charitable institution/self-help group, with 120 sq. ft. of space",
    ],
    benefits: [
      "Generic medicines commonly priced 50-90% lower than branded equivalents",
      "Over 2,000 medicines and 300 surgical/consumable products in the basket",
      "Quality assured through WHO-GMP certified manufacturers and lab testing",
      "Nationwide network of Kendras, searchable by location",
      "Business opportunity with incentive support for those opening a Kendra",
    ],
    documents: [
      "To purchase: doctor's prescription for prescription-only medicines",
      "To open a Kendra: Aadhaar, PAN, pharmacist registration certificate, proof of premises, bank details",
    ],
    process: [
      "To buy medicines: locate your nearest Jan Aushadhi Kendra on janaushadhi.gov.in and visit with your prescription",
      "To open a Kendra: register on janaushadhi.gov.in and apply online",
      "Upload the required documents and pay the application fee",
      "PMBI verifies the premises and issues the Kendra code on approval",
    ],
    url: "https://janaushadhi.gov.in/",
  },
  {
    slug: "ayushman-arogya-mandir",
    name: "Ayushman Arogya Mandir (Health & Wellness Centres)",
    shortName: "Ayushman Arogya Mandir",
    authority: "National Health Mission, Ministry of Health & Family Welfare",
    summary: "Free comprehensive primary healthcare at upgraded sub-centres and PHCs near you.",
    description:
      "Ayushman Arogya Mandirs (earlier called Ayushman Bharat Health & Wellness Centres) are upgraded sub-health centres and primary health centres that deliver Comprehensive Primary Health Care — moving beyond maternal and child care to include screening and management of non-communicable diseases, mental health, elderly and palliative care.",
    purpose:
      "To bring free preventive, promotive and curative primary care closer to where people live and work, so that common illnesses and chronic conditions are caught early instead of becoming costly hospital emergencies.",
    eligibility: [
      "Open to all residents in the centre's catchment area",
      "No income, category or employment condition",
      "Services are free of cost at government Ayushman Arogya Mandirs",
    ],
    benefits: [
      "12 packages of comprehensive primary care, including care for pregnancy, childbirth and newborns",
      "Free screening for hypertension, diabetes and oral, breast and cervical cancers",
      "Free essential medicines and diagnostic tests as per the centre's list",
      "Teleconsultation with doctors and specialists through eSanjeevani",
      "Wellness activities such as yoga sessions and health awareness",
    ],
    documents: [
      "Any government ID (Aadhaar preferred) for registration",
      "ABHA number, if available, to link your records",
    ],
    process: [
      "Find your nearest Ayushman Arogya Mandir (sub-centre / PHC / UPHC) in your ward or village",
      "Register at the centre with an ID; a family folder is created",
      "Undergo the free screening and consultation offered by the CHO / doctor",
      "Collect prescribed free medicines and follow-up dates; referrals are given for higher care",
    ],
    url: "https://ab-hwc.nhp.gov.in/",
  },
  {
    slug: "ntep",
    name: "National Tuberculosis Elimination Programme (NTEP)",
    shortName: "NTEP",
    authority: "Central TB Division, Ministry of Health & Family Welfare",
    summary: "Free TB diagnosis, free treatment and monthly nutrition support of ₹1,000.",
    description:
      "NTEP provides free, quality-assured TB diagnosis and treatment across India, including molecular testing, drug-sensitive and drug-resistant TB regimens, treatment adherence support and nutritional assistance under Ni-kshay Poshan Yojana.",
    purpose:
      "To end TB in India by finding every case early, treating it free of cost, and protecting patients from the income and nutrition loss that TB treatment causes — a major risk for workers dependent on daily earnings.",
    eligibility: [
      "Any person in India with presumptive or diagnosed TB, regardless of income or occupation",
      "Nutrition support under Ni-kshay Poshan Yojana: all notified TB patients, including those treated in the private sector",
      "Notification on the Ni-kshay portal is required for the benefit transfer",
    ],
    benefits: [
      "Free sputum microscopy, NAAT/molecular testing, X-ray and drug-susceptibility testing",
      "Free anti-TB drugs for the full course, including for drug-resistant TB",
      "₹1,000 per month direct benefit transfer for nutrition while on treatment (Ni-kshay Poshan Yojana)",
      "Treatment adherence support and counselling through the local TB unit",
      "Contact screening and TB preventive treatment for household members",
    ],
    documents: [
      "Aadhaar and mobile number for Ni-kshay notification and DBT",
      "Bank account details (account in the patient's name) for the nutrition transfer",
      "Diagnostic reports, if tested at a private facility",
    ],
    process: [
      "Report a cough of two weeks or more, fever, weight loss or night sweats at any government health facility or Ayushman Arogya Mandir",
      "Get free sputum / molecular testing at the designated microscopy or NAAT centre",
      "If diagnosed, the facility notifies you on the Ni-kshay portal and starts free treatment",
      "Provide Aadhaar and bank details for the ₹1,000 monthly nutrition benefit",
      "Complete the full course with follow-up tests at the TB unit",
    ],
    url: "https://www.nikshay.in/",
  },
  {
    slug: "nacp",
    name: "National AIDS Control Programme (NACP)",
    shortName: "NACP",
    authority: "National AIDS Control Organisation (NACO), Ministry of Health & Family Welfare",
    summary: "Free, confidential HIV testing, counselling and lifelong antiretroviral treatment.",
    description:
      "NACP is India's national response to HIV/AIDS, offering free and confidential HIV counselling and testing, free antiretroviral therapy (ART) for life, prevention of parent-to-child transmission, STI/RTI treatment and blood safety services through a nationwide network of ICTCs and ART centres.",
    purpose:
      "To prevent new HIV infections and ensure that every person living with HIV receives free treatment and care without stigma, discrimination or cost — protected by the HIV/AIDS (Prevention and Control) Act, 2017.",
    eligibility: [
      "HIV counselling and testing: available free to anyone who walks in",
      "Free ART: any person confirmed HIV positive, irrespective of CD4 count, income or occupation",
      "Services for pregnant women, key populations and migrant workers are prioritised",
    ],
    benefits: [
      "Free and confidential HIV testing and pre/post-test counselling at ICTCs",
      "Free lifelong antiretroviral therapy and CD4/viral load monitoring at ART centres",
      "Free prevention of parent-to-child transmission services for pregnant women",
      "Free diagnosis and treatment of sexually transmitted infections",
      "Legal protection against discrimination under the HIV/AIDS Act, 2017",
    ],
    documents: [
      "No document is mandatory for testing; services are confidential",
      "For ART registration: any ID proof and address details where available, plus the HIV test report",
    ],
    process: [
      "Visit any Integrated Counselling and Testing Centre (ICTC) at a government hospital, or call the toll-free helpline 1097",
      "Receive free counselling and an HIV test with same-day results",
      "If positive, get referred and registered at the nearest ART centre",
      "Start free antiretroviral therapy and attend scheduled follow-up visits",
    ],
    url: "https://naco.gov.in/",
  },
  {
    slug: "mission-indradhanush",
    name: "Mission Indradhanush",
    shortName: "Mission Indradhanush",
    authority: "Universal Immunization Programme, Ministry of Health & Family Welfare",
    summary: "Free catch-up vaccination drive for children up to 5 years and pregnant women.",
    description:
      "Mission Indradhanush, and its Intensified Mission Indradhanush rounds, is a targeted immunisation drive to reach children and pregnant women who were missed or partially covered under routine immunisation, with special focus on urban slums, construction sites, brick kilns, nomadic and migrant families.",
    purpose:
      "To achieve full immunisation coverage against vaccine-preventable diseases and reach exactly the mobile, informal-sector families — construction, delivery and daily-wage workers — who most often miss routine vaccination sessions.",
    eligibility: [
      "Children up to 5 years of age who are unvaccinated or partially vaccinated",
      "Pregnant women who have missed their tetanus-diphtheria doses",
      "Priority to migrant, slum, construction-site, brick-kiln and hard-to-reach families",
      "Free of cost with no income or category condition",
    ],
    benefits: [
      "Free vaccines against 12 diseases, including TB, polio, diphtheria, pertussis, tetanus, hepatitis B, measles-rubella and pneumonia",
      "Special outreach sessions at worksites, slums and migrant settlements",
      "Free Td vaccination and antenatal linkage for pregnant women",
      "Digital vaccination records through U-WIN",
    ],
    documents: [
      "Mother and Child Protection (MCP) card, if issued",
      "Any ID / Aadhaar of the parent for U-WIN registration (helpful, not a barrier to vaccination)",
    ],
    process: [
      "Contact your ASHA / ANM worker or the nearest Ayushman Arogya Mandir to know the session day",
      "Attend the Village Health & Nutrition Day or special Indradhanush outreach session",
      "Get the missed doses administered free and recorded in the MCP card / U-WIN",
      "Follow the due-date reminders for remaining doses",
    ],
    url: "https://www.nhm.gov.in/index1.php?lang=1&level=2&sublinkid=824&lid=220",
  },
  {
    slug: "jsy",
    name: "Janani Suraksha Yojana (JSY)",
    shortName: "JSY",
    authority: "National Health Mission, Ministry of Health & Family Welfare",
    summary: "Cash assistance for institutional delivery — up to ₹1,400 in rural areas.",
    description:
      "JSY is a safe motherhood intervention under the National Health Mission that provides conditional cash assistance to pregnant women who deliver in a government or accredited health facility, with ASHA workers linking the mother to antenatal care, delivery and post-natal follow-up.",
    purpose:
      "To reduce maternal and newborn deaths by making institutional delivery affordable for poor households, and to compensate for wage loss around childbirth.",
    eligibility: [
      "In Low Performing States: all pregnant women delivering in a government or accredited private facility",
      "In High Performing States: BPL / SC / ST pregnant women aged 19 years and above",
      "Cash benefit generally for up to two live births (relaxed for BPL women in LPS)",
      "Delivery must be in a government facility or an accredited private facility",
    ],
    benefits: [
      "Rural: ₹1,400 to the mother and ₹600 to the ASHA (Low Performing States)",
      "Urban: ₹1,000 to the mother and ₹400 to the ASHA (Low Performing States)",
      "High Performing States: ₹700 rural / ₹600 urban to the mother",
      "Free antenatal check-ups, delivery care and post-natal visits",
      "ASHA support for registration, transport and facility linkage",
    ],
    documents: [
      "JSY / MCP card with antenatal registration",
      "Aadhaar of the mother",
      "Bank or post office account details in the mother's name",
      "BPL / SC / ST certificate where the state requires it",
      "Proof of institutional delivery (discharge slip / birth record)",
    ],
    process: [
      "Register the pregnancy with an ASHA / ANM at the nearest Ayushman Arogya Mandir, ideally in the first trimester",
      "Attend all free antenatal check-ups and get the MCP/JSY card filled",
      "Deliver at a government or accredited facility with ASHA assistance",
      "Submit Aadhaar and bank details at the facility for the benefit transfer",
      "Cash assistance is credited directly to the mother's account after delivery",
    ],
    url: "https://nhm.gov.in/index1.php?lang=1&level=3&sublinkid=841&lid=309",
  },
  {
    slug: "jssk",
    name: "Janani Shishu Suraksha Karyakram (JSSK)",
    shortName: "JSSK",
    authority: "National Health Mission, Ministry of Health & Family Welfare",
    summary: "Zero-cost delivery and newborn care — free drugs, tests, diet, blood and transport.",
    description:
      "JSSK entitles every pregnant woman delivering in a public health facility, and every sick newborn and infant up to one year, to completely free treatment — including free caesarean section, drugs, consumables, diagnostics, diet, blood and referral transport, with no out-of-pocket expense.",
    purpose:
      "To eliminate the out-of-pocket cost of childbirth and newborn illness in public facilities, so no family has to borrow or skip care during delivery.",
    eligibility: [
      "All pregnant women delivering in a public health institution, regardless of income",
      "Women undergoing caesarean section in public facilities",
      "Sick newborns and infants up to one year of age treated in public facilities",
      "Also covers complications during abortion and management of post-abortion care as per guidelines",
    ],
    benefits: [
      "Free delivery, including free caesarean section",
      "Free drugs, consumables and diagnostics (lab tests, ultrasound)",
      "Free diet — up to 3 days for normal delivery and 7 days for caesarean",
      "Free blood transfusion when required",
      "Free transport: home to facility, referral between facilities and drop back home",
      "Free treatment for sick newborns and infants up to one year",
    ],
    documents: [
      "MCP card / antenatal registration record",
      "Any ID proof of the mother (Aadhaar preferred)",
      "Referral slip, if referred from another facility",
    ],
    process: [
      "Register the pregnancy at any government health facility and attend free antenatal check-ups",
      "Call 102 / 108 for free transport to the facility when labour begins",
      "Avail free delivery, medicines, tests, blood and diet — you must not be charged",
      "Use free drop-back transport home after discharge",
      "Report any demand for payment to the facility in-charge or the state health helpline 104",
    ],
    url: "https://nhm.gov.in/index1.php?lang=1&level=3&sublinkid=842&lid=308",
  },
];

export const findHealthScheme = (slug: string) => HEALTH_SCHEMES.find((s) => s.slug === slug);
