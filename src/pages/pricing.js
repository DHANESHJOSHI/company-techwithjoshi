import Breadcrumb from "@/components/common/Breadcrumb";
import Layout from "@/components/layout/Layout";
import PricingPlan3 from "@/components/pricingplan/PricingPlan3";
import React from "react";

function PricingPage() {
  return (
    <Layout>
      <Breadcrumb pageList="Pricing" title="Flexible Engineering Engagements" pageName="PRICING" />
      <PricingPlan3 />
    </Layout>
  );
}

export default PricingPage;
