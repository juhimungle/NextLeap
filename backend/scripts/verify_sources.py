import requests
import csv
import os

sources_to_test = [
    {
        "source_id": "HDFC_FLEXI_SID",
        "source_title": "HDFC Flexi Cap Fund - Scheme Information Document (SID)",
        "url": "https://files.hdfcfund.com/s3fs-public/SID/2025-11/SID%20-%20HDFC%20Flexi%20Cap%20Fund%20dated%20November%2021%2C%202025_0.pdf",
        "source_type": "AMC",
        "amc": "HDFC Mutual Fund",
        "scheme": "HDFC Flexi Cap Fund",
        "document_type": "SID",
        "last_updated": "2025-11-21"
    },
    {
        "source_id": "HDFC_FLEXI_KIM",
        "source_title": "HDFC Flexi Cap Fund - Key Information Memorandum (KIM)",
        "url": "https://files.hdfcfund.com/s3fs-public/KIM/2025-11/KIM%20-%20HDFC%20Flexi%20Cap%20Fund%20dated%20November%2021%2C%202025_1.pdf",
        "source_type": "AMC",
        "amc": "HDFC Mutual Fund",
        "scheme": "HDFC Flexi Cap Fund",
        "document_type": "KIM",
        "last_updated": "2025-11-21"
    },
    {
        "source_id": "HDFC_LARGE_SID",
        "source_title": "HDFC Large Cap Fund (formerly Top 100) - Scheme Information Document (SID)",
        "url": "https://files.hdfcfund.com/s3fs-public/SID/2025-11/SID%20-%20HDFC%20Large%20Cap%20Fund%20dated%20November%2021%2C%202025_0.pdf",
        "source_type": "AMC",
        "amc": "HDFC Mutual Fund",
        "scheme": "HDFC Large Cap Fund",
        "document_type": "SID",
        "last_updated": "2025-11-21"
    },
    {
        "source_id": "HDFC_LARGE_KIM",
        "source_title": "HDFC Large Cap Fund - Key Information Memorandum (KIM)",
        "url": "https://files.hdfcfund.com/s3fs-public/KIM/2025-05/KIM%20-%20HDFC%20Large%20Cap%20Fund%20dated%20May%2030%2C%202025.pdf",
        "source_type": "AMC",
        "amc": "HDFC Mutual Fund",
        "scheme": "HDFC Large Cap Fund",
        "document_type": "KIM",
        "last_updated": "2025-05-30"
    },
    {
        "source_id": "HDFC_LARGE_ADDENDUM",
        "source_title": "HDFC Mutual Fund Addendum - Change in Name of HDFC Top 100 Fund to HDFC Large Cap Fund",
        "url": "https://files.hdfcfund.com/s3fs-public/2024-12/1280%20-%20Addendum%20-%20Change%20in%20name%20of%20HDFC%20Top%20100%20Fund%20w.e..f.%20Jan%2001%2C%202025.pdf",
        "source_type": "AMC",
        "amc": "HDFC Mutual Fund",
        "scheme": "HDFC Large Cap Fund",
        "document_type": "Addendum",
        "last_updated": "2024-12-24"
    },
    {
        "source_id": "HDFC_ELSS_SID",
        "source_title": "HDFC ELSS Tax Saver - Scheme Information Document (SID)",
        "url": "https://files.hdfcfund.com/s3fs-public/SID/2024-06/SID%20-%20HDFC%20ELSS%20Tax%20saver%20dated%20June%2028%2C%202024.pdf",
        "source_type": "AMC",
        "amc": "HDFC Mutual Fund",
        "scheme": "HDFC ELSS Tax Saver",
        "document_type": "SID",
        "last_updated": "2024-06-28"
    },
    {
        "source_id": "HDFC_ELSS_KIM",
        "source_title": "HDFC ELSS Tax Saver - Key Information Memorandum (KIM)",
        "url": "https://files.hdfcfund.com/s3fs-public/KIM/2025-05/KIM%20-%20HDFC%20ELSS%20Tax%20saver%20dated%20May%2030%2C%202025.pdf",
        "source_type": "AMC",
        "amc": "HDFC Mutual Fund",
        "scheme": "HDFC ELSS Tax Saver",
        "document_type": "KIM",
        "last_updated": "2025-05-30"
    },
    {
        "source_id": "HDFC_MIDCAP_SID",
        "source_title": "HDFC Mid-Cap Opportunities Fund - Scheme Information Document (SID)",
        "url": "https://files.hdfcfund.com/s3fs-public/SID/2023-04/SID-HDFC%20Mid%20Cap%20Opporunities%20Fund%20dated%20April%2028%2C%202023.pdf",
        "source_type": "AMC",
        "amc": "HDFC Mutual Fund",
        "scheme": "HDFC Mid-Cap Opportunities Fund",
        "document_type": "SID",
        "last_updated": "2023-04-28"
    },
    {
        "source_id": "HDFC_MIDCAP_KIM",
        "source_title": "HDFC Mid-Cap Opportunities Fund - Key Information Memorandum (KIM)",
        "url": "https://files.hdfcfund.com/s3fs-public/KIM/2025-05/KIM%20-%20HDFC%20Mid%20Cap%20Opportunities%20Fund%20dated%20May%2030%2C%202025.pdf",
        "source_type": "AMC",
        "amc": "HDFC Mutual Fund",
        "scheme": "HDFC Mid-Cap Opportunities Fund",
        "document_type": "KIM",
        "last_updated": "2025-05-30"
    },
    {
        "source_id": "HDFC_FACTSHEET",
        "source_title": "HDFC Mutual Fund Monthly Factsheet Disclosures",
        "url": "https://files.hdfcfund.com/s3fs-public/2025-05/HDFC%20MF%20Factsheet%20-%20April%202025.pdf",
        "source_type": "AMC",
        "amc": "HDFC Mutual Fund",
        "scheme": "All schemes",
        "document_type": "Factsheet",
        "last_updated": "2025-04-30"
    },
    {
        "source_id": "HDFC_TAX_RECKONER",
        "source_title": "HDFC Mutual Fund Tax Reckoner - Capital Gains and Statutory Tax Provisions",
        "url": "https://files.hdfcfund.com/s3fs-public/2023-05/Tax%20Reckoner%20FY%202023-2024.pdf",
        "source_type": "AMC",
        "amc": "HDFC Mutual Fund",
        "scheme": "All schemes",
        "document_type": "Tax Guide",
        "last_updated": "2023-05-15"
    },
    {
        "source_id": "HDFC_SIP_ADDENDUM",
        "source_title": "HDFC Mutual Fund Systematic Investment Plan (SIP) Operations Addendum",
        "url": "https://files.hdfcfund.com/s3fs-public/2023-02/1136-Addendum-Dream%20SIP%20Facility-Availability%20on%20BSE%20platform.pdf",
        "source_type": "AMC",
        "amc": "HDFC Mutual Fund",
        "scheme": "All schemes",
        "document_type": "Operations Guide",
        "last_updated": "2023-02-15"
    },
    {
        "source_id": "AMFI_EXPENSE_RATIO",
        "source_title": "AMFI Knowledge Centre: Understanding Total Expense Ratio (TER)",
        "url": "https://www.amfiindia.com/investor/knowledge-center-info?zoneName=expenseRatio",
        "source_type": "AMFI",
        "amc": "Industry",
        "scheme": "All schemes",
        "document_type": "Educational",
        "last_updated": "2026-10-02"
    },
    {
        "source_id": "AMFI_INTRO_MF",
        "source_title": "AMFI Knowledge Centre: Introduction to Mutual Funds",
        "url": "https://www.amfiindia.com/investor/knowledge-center-info?zoneName=IntroductionMutualFunds",
        "source_type": "AMFI",
        "amc": "Industry",
        "scheme": "All schemes",
        "document_type": "Educational",
        "last_updated": "2026-10-02"
    },
    {
        "source_id": "AMFI_TYPES_SCHEMES",
        "source_title": "AMFI Knowledge Centre: Types of Mutual Fund Schemes",
        "url": "https://www.amfiindia.com/investor/knowledge-center-info?zoneName=TypesOfMutualFundSchemes",
        "source_type": "AMFI",
        "amc": "Industry",
        "scheme": "All schemes",
        "document_type": "Educational",
        "last_updated": "2026-10-02"
    },
    {
        "source_id": "AMFI_CATEGORIZATION",
        "source_title": "AMFI Knowledge Centre: SEBI Categorization and Rationalization of Mutual Fund Schemes",
        "url": "https://www.amfiindia.com/investor/knowledge-center-info?zoneName=CategorizationOfMutualFundSchemes",
        "source_type": "AMFI",
        "amc": "Industry",
        "scheme": "All schemes",
        "document_type": "Regulatory/Educational",
        "last_updated": "2026-10-02"
    },
    {
        "source_id": "AMFI_TAX_REGIME",
        "source_title": "AMFI Knowledge Centre: Tax Regime for Mutual Funds in India",
        "url": "https://www.amfiindia.com/investor/knowledge-center-info?zoneName=TaxRegimeForMutualFunds",
        "source_type": "AMFI",
        "amc": "Industry",
        "scheme": "All schemes",
        "document_type": "Taxation/Educational",
        "last_updated": "2026-10-02"
    },
    {
        "source_id": "AMFI_NAV",
        "source_title": "AMFI Knowledge Centre: Net Asset Value (NAV) Determination and Valuation",
        "url": "https://www.amfiindia.com/investor/knowledge-center-info?zoneName=NetAssetValueNAV",
        "source_type": "AMFI",
        "amc": "Industry",
        "scheme": "All schemes",
        "document_type": "Educational",
        "last_updated": "2026-10-02"
    },
    {
        "source_id": "AMFI_ADVANTAGES",
        "source_title": "AMFI Knowledge Centre: Advantages of Investing in Mutual Funds",
        "url": "https://www.amfiindia.com/investor/knowledge-center-info?zoneName=AdvantagesOfInvestingInMutualFunds",
        "source_type": "AMFI",
        "amc": "Industry",
        "scheme": "All schemes",
        "document_type": "Educational",
        "last_updated": "2026-10-02"
    },
    {
        "source_id": "AMFI_CUTOFF_NAV",
        "source_title": "AMFI Knowledge Centre: Cut-Off Timings and Applicable NAV Rules",
        "url": "https://www.amfiindia.com/investor/knowledge-center-info?zoneName=CutOffTimingsAndNewRuleOnApplicableNAV",
        "source_type": "AMFI",
        "amc": "Industry",
        "scheme": "All schemes",
        "document_type": "Operational/Regulatory",
        "last_updated": "2026-10-02"
    },
    {
        "source_id": "AMFI_MYTHS_FACTS",
        "source_title": "AMFI Knowledge Centre: Myths and Facts About Mutual Funds",
        "url": "https://www.amfiindia.com/investor/knowledge-center-info?zoneName=MythsAndFactsAboutMutualFunds",
        "source_type": "AMFI",
        "amc": "Industry",
        "scheme": "All schemes",
        "document_type": "Educational",
        "last_updated": "2026-10-02"
    },
    {
        "source_id": "SEBI_INVESTOR_FAQS",
        "source_title": "SEBI Official FAQs for Mutual Fund Investors",
        "url": "https://www.sebi.gov.in/sebi_data/faqfiles/sep-2024/1727242783639.pdf",
        "source_type": "SEBI",
        "amc": "Statutory/SEBI",
        "scheme": "All schemes",
        "document_type": "Regulatory FAQs",
        "last_updated": "2024-09-25"
    },
    {
        "source_id": "SEBI_INTERMEDIARY_FAQS",
        "source_title": "SEBI Official FAQs for Mutual Fund Intermediaries and Operations",
        "url": "https://www.sebi.gov.in/sebi_data/faqfiles/sep-2024/1727242760185.pdf",
        "source_type": "SEBI",
        "amc": "Statutory/SEBI",
        "scheme": "All schemes",
        "document_type": "Regulatory FAQs",
        "last_updated": "2024-09-25"
    },
    {
        "source_id": "SEBI_MASTER_FAQS",
        "source_title": "SEBI Master Investor FAQs and Grievance Redressal Portal",
        "url": "https://www.sebi.gov.in/sebiweb/other/OtherAction.do?doFaq=yes",
        "source_type": "SEBI",
        "amc": "Statutory/SEBI",
        "scheme": "All schemes",
        "document_type": "Official Portal",
        "last_updated": "2024-09-25"
    }
]

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
}

print(f"Testing {len(sources_to_test)} sources...")
verified_sources = []
failed_sources = []

for s in sources_to_test:
    url = s["url"]
    try:
        r = requests.get(url, headers=headers, timeout=12, stream=True)
        if r.status_code == 200:
            content_len = len(r.content)
            if content_len > 1000:
                print(f"[OK] {s['source_id']} ({content_len} bytes) - {s['source_title'][:50]}")
                verified_sources.append(s)
            else:
                print(f"[WARN: Too Small] {s['source_id']} len={content_len}")
                failed_sources.append((s, f"Content too small: {content_len}"))
        else:
            print(f"[FAIL {r.status_code}] {s['source_id']} - {url}")
            failed_sources.append((s, f"Status code {r.status_code}"))
    except Exception as e:
        print(f"[ERR] {s['source_id']} - {e}")
        failed_sources.append((s, str(e)))

print("\n--- Summary ---")
print(f"Verified: {len(verified_sources)} / {len(sources_to_test)}")
print(f"Failed: {len(failed_sources)}")

# Write to sources.csv
csv_path = "sources.csv"
fieldnames = ["source_id", "source_title", "url", "source_type", "amc", "scheme", "document_type", "last_updated"]
with open(csv_path, "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=fieldnames)
    writer.writeheader()
    for s in verified_sources:
        writer.writerow(s)

print(f"Written verified sources to {csv_path}")
