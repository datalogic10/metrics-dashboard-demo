// Generates realistic time-series analytics data at WEEKLY granularity for demo purposes.
// Jan 2023 - current date x 4 products x 4 regions (weekly rows).
// Supports Weekly / Monthly / Quarterly / Yearly aggregation via reporting_* fields.
// Growth rates are deliberately divergent to surface compelling Category Trend insights.
export function generateSyntheticData() {
  var rows = [];
  var rngState = 1234567891;
  var rng = function() {
    rngState = (rngState * 1664525 + 1013904223) & 0x7fffffff;
    return rngState / 0x7fffffff;
  };

  var productNames = ["Core Product", "Support Add-on", "Analytics Add-on", "Enterprise Suite"];

  var productGroupMap = {
    "Core Product": "Core Products",
    "Support Add-on": "Core Products",
    "Analytics Add-on": "Growth Products",
    "Enterprise Suite": "Growth Products",
  };

  var pricingTypeMap = {
    "Core Product": ["Annual Contract", "Monthly Subscription"],
    "Support Add-on": ["Volume License", "Monthly Subscription"],
    "Analytics Add-on": ["Usage-Based", "Annual Contract"],
    "Enterprise Suite": ["Annual Contract", "Volume License"],
  };

  var regions = ["NA", "EMEA", "APAC", "LATAM"];
  var countryMap = {
    "NA": ["US", "Canada"],
    "EMEA": ["UK", "Germany", "France"],
    "APAC": ["Japan", "Australia", "Singapore"],
    "LATAM": ["Brazil", "Mexico"],
  };
  var channels = ["Direct", "Partner", "Self-Serve", "Inbound"];
  var channelTypeMap = {
    "Direct": "Sales-Led",
    "Partner": "Partner-Led",
    "Self-Serve": "Product-Led",
    "Inbound": "Marketing-Led",
  };
  var segmentMap = {
    "Core Product": "Enterprise",
    "Support Add-on": "SMB",
    "Analytics Add-on": "Mid-Market",
    "Enterprise Suite": "Enterprise",
  };
  var acquisitionChannels = ["Organic Search", "Paid Search", "Referral", "Partnership"];
  var customerTypes = ["Tech-Native", "Traditional", "Digital-First"];

  var baseWeeklyVolumes = {
    "Core Product": 120000000 / 52,
    "Support Add-on": 45000000 / 52,
    "Analytics Add-on": 35000000 / 52,
    "Enterprise Suite": 60000000 / 52,
  };
  var regionFactors = { "NA": 0.45, "EMEA": 0.30, "APAC": 0.18, "LATAM": 0.07 };
  var marginRates = {
    "Core Product": 0.30,
    "Support Add-on": 0.20,
    "Analytics Add-on": 0.35,
    "Enterprise Suite": 0.28,
  };
  // Deliberately divergent annual growth rates for compelling insights demo
  var annualGrowthRates = {
    "Core Product": 0.32,
    "Support Add-on": -0.18,
    "Analytics Add-on": 0.85,
    "Enterprise Suite": 0.55,
  };

  var currentDate = new Date(2023, 0, 2);
  var today = new Date();
  var dayOfWeek = today.getDay();
  var endDate = new Date(today);
  endDate.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
  var weekIndex = 0;

  while (currentDate <= endDate) {
    var yr = currentDate.getFullYear();
    var mo = currentDate.getMonth() + 1;
    var dy = currentDate.getDate();
    var moStr = mo < 10 ? "0" + mo : String(mo);
    var dyStr = dy < 10 ? "0" + dy : String(dy);

    var weekStr = yr + "-" + moStr + "-" + dyStr;
    var monthStr = yr + "-" + moStr + "-01";
    var quarter = Math.ceil(mo / 3);
    var quarterStr = yr + "-Q" + quarter;
    var yearStr = String(yr);

    for (var pIdx = 0; pIdx < productNames.length; pIdx++) {
      var productName = productNames[pIdx];
      var growthRate = annualGrowthRates[productName];
      var weeklyGrowthFactor = Math.pow(1 + growthRate, weekIndex / 52);

      for (var rIdx = 0; rIdx < regions.length; rIdx++) {
        var region = regions[rIdx];
        var regionFactor = regionFactors[region];
        var countries = countryMap[region];
        var country = countries[(pIdx + rIdx) % countries.length];

        var noise = 0.92 + rng() * 0.16;
        var seasonality = 1 + 0.12 * Math.sin((mo - 3) * Math.PI / 6);

        var volume = Math.round(
          baseWeeklyVolumes[productName] * regionFactor *
          weeklyGrowthFactor * seasonality * noise
        );
        var marginRate = marginRates[productName];
        var revenue = Math.round(volume * marginRate * (0.95 + rng() * 0.10));

        var comboIdx = pIdx * regions.length + rIdx;
        var channel = channels[comboIdx % channels.length];
        var channelType = channelTypeMap[channel];
        var segment = segmentMap[productName];
        var acqChannel = acquisitionChannels[comboIdx % acquisitionChannels.length];
        var customerType = customerTypes[pIdx % customerTypes.length];
        var pricingTypes = pricingTypeMap[productName];
        var pricingType = pricingTypes[rIdx % pricingTypes.length];

        rows.push({
          reporting_week: weekStr,
          reporting_month: monthStr,
          reporting_quarter: quarterStr,
          reporting_year: yearStr,
          product_group_l1: productGroupMap[productName],
          product_name: productName,
          product: pricingType,
          region: region,
          country: country,
          channel: channel,
          channel_type: channelType,
          customer_segment: segment,
          acquisition_channel: acqChannel,
          customer_type: customerType,
          volume: volume,
          revenue: revenue,
        });
      }
    }

    currentDate.setDate(currentDate.getDate() + 7);
    weekIndex++;
  }

  return { rows: rows };
}

// Column mapping for the synthetic demo dataset
export const DEMO_COLUMNS = {
  REPORTING_WEEK: "reporting_week",
  REPORTING_MONTH: "reporting_month",
  REPORTING_QUARTER: "reporting_quarter",
  REPORTING_YEAR: "reporting_year",
  PRODUCT_GROUP_L1: "product_group_l1",
  PRODUCT_NAME: "product_name",
  PRODUCT: "product",
  CUSTOMER_SEGMENT: "customer_segment",
  REGION: "region",
  COUNTRY: "country",
  ACQUISITION_CHANNEL: "acquisition_channel",
  CUSTOMER_TYPE: "customer_type",
  CHANNEL: "channel",
  CHANNEL_TYPE: "channel_type",
  VOLUME: "volume",
  REVENUE: "revenue",
};

// Dimension definitions for the synthetic demo dataset
export const DEMO_DIMENSION_DEFINITIONS = [
  {
    columnKey: "PRODUCT_GROUP_L1",
    filterKey: "productGroupFilter",
    abbreviation: "pg",
    filterLabel: "Product Group",
    viewName: "Product Group",
    viewLabel: "Product Groups",
    insightLabel: "product group",
    marketLeaderLabel: "product groups",
    insightTextPrefix: "leads",
    isProductDimension: true,
    displayOrder: 1,
  },
  {
    columnKey: "PRODUCT_NAME",
    filterKey: "productFilter",
    abbreviation: "pn",
    filterLabel: "Product",
    viewName: "Product",
    viewLabel: "Products",
    insightLabel: "product",
    marketLeaderLabel: "products",
    insightTextPrefix: "leads",
    isProductDimension: true,
    displayOrder: 2,
  },
  {
    columnKey: "PRODUCT",
    filterKey: "pricingTypeFilter",
    abbreviation: "pt",
    filterLabel: "Pricing Type",
    viewName: "Pricing Type",
    viewLabel: "Pricing Types",
    insightLabel: "pricing type",
    marketLeaderLabel: "pricing types",
    insightTextPrefix: "leads",
    isProductDimension: true,
    displayOrder: 3,
  },
  {
    columnKey: "COUNTRY",
    filterKey: "revenueCountryFilter",
    abbreviation: "rc",
    filterLabel: "Country",
    viewName: "Country",
    viewLabel: "Countries",
    insightLabel: "country",
    marketLeaderLabel: "countries",
    insightTextPrefix: "leads",
    isProductDimension: false,
    displayOrder: 4,
  },
  {
    columnKey: "REGION",
    filterKey: "revenueRegionFilter",
    abbreviation: "rr",
    filterLabel: "Region",
    viewName: "Region",
    viewLabel: "Regions",
    insightLabel: "region",
    marketLeaderLabel: "regions",
    insightTextPrefix: "leads",
    isProductDimension: false,
    displayOrder: 5,
  },
  {
    columnKey: "CHANNEL",
    filterKey: "channelFilter",
    abbreviation: "ch",
    filterLabel: "Channel",
    viewName: "Channel",
    viewLabel: "Channels",
    insightLabel: "channel",
    marketLeaderLabel: "channels",
    insightTextPrefix: "leads",
    isProductDimension: false,
    displayOrder: 6,
  },
  {
    columnKey: "CHANNEL_TYPE",
    filterKey: "channelTypeFilter",
    abbreviation: "cht",
    filterLabel: "Channel Type",
    viewName: "Channel Type",
    viewLabel: "Channel Types",
    insightLabel: "channel type",
    marketLeaderLabel: "channel types",
    insightTextPrefix: "leads",
    isProductDimension: false,
    displayOrder: 7,
  },
  {
    columnKey: "CUSTOMER_SEGMENT",
    filterKey: "companySegmentFilter",
    abbreviation: "cs",
    filterLabel: "Customer Segment",
    viewName: "Customer Segment",
    viewLabel: "Customer Segments",
    insightLabel: "segment",
    marketLeaderLabel: "segments",
    insightTextPrefix: "leads",
    isProductDimension: false,
    displayOrder: 8,
  },
  {
    columnKey: "ACQUISITION_CHANNEL",
    filterKey: "acquisitionChannelFilter",
    abbreviation: "ac",
    filterLabel: "Acquisition Channel",
    viewName: "Acquisition Channel",
    viewLabel: "Acquisition Channels",
    insightLabel: "acquisition channel",
    marketLeaderLabel: "acquisition channels",
    insightTextPrefix: "leads",
    isProductDimension: false,
    displayOrder: 9,
  },
  {
    columnKey: "CUSTOMER_TYPE",
    filterKey: "isAiCompanyFilter",
    abbreviation: "ct",
    filterLabel: "Customer Type",
    viewName: "Customer Type",
    viewLabel: "Customer Types",
    insightLabel: "customer type",
    marketLeaderLabel: "customer types",
    insightTextPrefix: "leads",
    isProductDimension: false,
    displayOrder: 10,
  },
];
