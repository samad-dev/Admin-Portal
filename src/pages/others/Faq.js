import React from "react";
import Content from "../../layout/content/Content";
import Head from "../../layout/head/Head";
import { Block, BlockDes, BlockHead, BlockHeadContent, BlockTitle, PreviewCard } from "../../components/Component";

const Faq = ({ ...props }) => {
  return (
    <React.Fragment>
      <Head title="Faq &amp; Conditions" />
      <Content>
        <div className="content-page wide-md m-auto">
          {/* <BlockHead size="lg" wide="xs" className="mx-auto">
            <BlockHeadContent className="text-center">
              <BlockTitle tag="h2" className="fw-normal">
                Faq &amp; Policy
              </BlockTitle>
              <BlockDes>
                <p className="lead">
                  We are on a mission to make the web a better place. The following Faq, as well as our Policy and
                  Faq of Service, apply to all users.
                </p>
                <p className="text-soft ff-italic">Last Update: Nov 12, 2019</p>
              </BlockDes>
            </BlockHeadContent>
          </BlockHead> */}
          <Block>
            <PreviewCard className="card-bordered">
              <>
                <style
                  type="text/css"
                  dangerouslySetInnerHTML={{
                    __html:
                      "\n        * {\n            margin: 0;\n            padding: 0;\n            text-indent: 0;\n        }\n\n        h1 {\n            color: black;\n            font-family: Arial, sans-serif;\n            font-style: normal;\n            font-weight: bold;\n            text-decoration: underline;\n            font-size: 24pt;\n        }\n\n        h2 {\n            color: black;\n            font-family: Arial, sans-serif;\n            font-style: normal;\n            font-weight: bold;\n            text-decoration: none;\n            font-size: 16pt;\n        }\n\n        .p,\n        p {\n            color: black;\n            font-family: Arial, sans-serif;\n            font-style: normal;\n            font-weight: normal;\n            text-decoration: none;\n            font-size: 13.5pt;\n            margin: 0pt;\n        }\n\n        .s1 {\n            color: black;\n            font-family: Arial, sans-serif;\n            font-style: normal;\n            font-weight: normal;\n            text-decoration: none;\n            font-size: 12pt;\n        }\n\n "
                  }}
                />
                <h1
                  style={{
                    paddingTop: "3pt",
                    textIndent: "0pt",
                    textAlign: "center"
                  }}
                >
                  CASANTEY GLOBAL POLICY
                </h1>
                <p style={{ textIndent: "0pt", textAlign: "left" }}>
                  <br />
                </p>
                <h2
                  style={{
                    paddingTop: "12pt",
                    paddingLeft: "5pt",
                    textIndent: "0pt",
                    textAlign: "justify"
                  }}
                >
                  Summary of our Privacy Policy
                </h2>
                <p
                  style={{
                    paddingTop: "1pt",
                    paddingLeft: "5pt",
                    textIndent: "0pt",
                    textAlign: "justify"
                  }}
                >
                  This is a summary of our new privacy policy which takes effect on January
                  25th, 2015. It covers every Casantey (CASANTEY) website that links here, and
                  all of the products and services contained on those websites. The{" "}
                  <span className="s1">detailed policy</span>follows the same structure as
                  this summary and constitutes the actual legal document.
                </p>
                <p style={{ paddingLeft: "5pt", textIndent: "0pt", textAlign: "justify" }}>
                  Our privacy commitment: CASANTEY has never sold your information to someone
                  else for advertising, or made money by showing you other people's ads, and
                  we never will. This has been our approach for almost 20 years, and we remain
                  committed to can access it, and what you can do about it.
                </p>
                <p style={{ textIndent: "0pt", textAlign: "left" }}>
                  <br />
                </p>
                <h2 style={{ paddingLeft: "5pt", textIndent: "0pt", textAlign: "justify" }}>
                  Part I – Information CASANTEY collects and controls
                </h2>
                <p
                  style={{
                    paddingTop: "1pt",
                    paddingLeft: "5pt",
                    textIndent: "0pt",
                    textAlign: "justify"
                  }}
                >
                  We only collect the information that we actually need. Some of that is
                  information that you actively give us when you sign up for an account,
                  register for an event, ask for customer support, or buy something from us.
                  We store your name and contact information, but we don't store credit card
                  numbers (except with your permission and in one of our secured payment
                  gateways).
                </p>
                <p style={{ textIndent: "0pt", textAlign: "left" }}>
                  <br />
                </p>
                <p style={{ paddingLeft: "5pt", textIndent: "0pt", textAlign: "justify" }}>
                  When you visit one of our websites or use our software, we automatically log
                  some basic information like how you got to the site, where you navigated
                  within it, and what features and settings you use. We use this information
                  to improve our websites and services and to drive new product development.
                </p>
                <p style={{ textIndent: "0pt", textAlign: "left" }}>
                  <br />
                </p>
                <p style={{ paddingLeft: "5pt", textIndent: "0pt", textAlign: "justify" }}>
                  Sometimes we receive information indirectly. If you ask about our products
                  through one of our referral programs or reselling partners or sign in to one
                  of our products through an authentication service provider like LinkedIn or
                  Google, they'll pass on your contact information to us. We'll use that
                  information to complete the request that you made. If you engage with our
                  brand on social media (for instance, liking, commenting, retweeting,
                  mentioning, or following us), we'll have access to your interactions and
                  profile information. We'll still have that information even if you later
                  remove it from the social media site.
                </p>
                <p style={{ textIndent: "0pt", textAlign: "left" }}>
                  <br />
                </p>
                <h2 style={{ paddingLeft: "5pt", textIndent: "0pt", textAlign: "justify" }}>
                  What we do with your information
                </h2>
                <p
                  style={{
                    paddingTop: "1pt",
                    paddingLeft: "5pt",
                    textIndent: "0pt",
                    textAlign: "justify"
                  }}
                >
                  We use your information to provide the services you've requested, create and
                  maintain your accounts, and keep an eye out for unauthorized activity on
                  your accounts. We also use it to communicate with you about the products
                  you're currently using, your customer support requests, new products you
                </p>
                <p
                  style={{
                    paddingTop: "3pt",
                    paddingLeft: "5pt",
                    textIndent: "0pt",
                    textAlign: "justify"
                  }}
                >
                  may like, chances for you to give us feedback, and policy updates. We
                  analyze the information we collect to understand user needs and to improve
                  our websites and services.
                </p>
                <p style={{ textIndent: "0pt", textAlign: "left" }}>
                  <br />
                </p>
                <p style={{ paddingLeft: "5pt", textIndent: "0pt", textAlign: "justify" }}>
                  We're required to have a legal basis for collecting and processing your
                  information. In most cases, we either have your consent or need the
                  information to provide the service you've requested from us. When that's not
                  the case, we must demonstrate that we have another legal basis, such as our
                  legitimate business interests.
                </p>
                <p style={{ textIndent: "0pt", textAlign: "left" }}>
                  <br />
                </p>
                <p style={{ paddingLeft: "5pt", textIndent: "0pt", textAlign: "justify" }}>
                  You can decline certain kinds of information use either by not providing the
                  information in the first place or by opting out later. You can also disable
                  cookies to prevent your browser from giving us information, but if you do
                  so, certain website features may not work properly. We completely disable
                  third-party cookies from all CASANTEY websites and products.
                </p>
                <p style={{ textIndent: "0pt", textAlign: "left" }}>
                  <br />
                </p>
                <p style={{ paddingLeft: "5pt", textIndent: "0pt", textAlign: "justify" }}>
                  We limit access to your personal information to our employees and
                  contractors who have a legitimate need to use it. If we share your
                  information with other parties (like developers, service providers, domain
                  registrars, and reselling partners), they must have appropriate security
                  measures and a valid reason for using your information, typically to serve
                  you.
                </p>
                <p style={{ textIndent: "0pt", textAlign: "left" }}>
                  <br />
                </p>
                <p style={{ paddingLeft: "5pt", textIndent: "0pt", textAlign: "justify" }}>
                  The European Economic Area (EEA) provides certain rights to data subjects
                  (including access, rectification, erasure, restriction of processing, data
                  portability, and the right to object and to complain). CASANTEY undertakes
                  to provide you the same rights no matter where you choose to live.
                </p>
                <p style={{ textIndent: "0pt", textAlign: "left" }}>
                  <br />
                </p>
                <p style={{ paddingLeft: "5pt", textIndent: "0pt", textAlign: "justify" }}>
                  We keep your personal information for as long as it is required for the
                  purposes stated in this Privacy Policy. When we no longer have a legitimate
                  need to process your information, we will delete, anonymize, or isolate your
                  information, whichever is appropriate.
                </p>
                <p style={{ textIndent: "0pt", textAlign: "left" }}>
                  <br />
                </p>
                <h2 style={{ paddingLeft: "5pt", textIndent: "0pt", textAlign: "justify" }}>
                  Part II – Information that CASANTEY processes on your behalf{" "}
                  <span className="p">
                    If you handle other people's data using CASANTEY apps, such as information
                    about your customers or employees, you are entrusting that data to us for
                    processing. If you use a CASANTEY mobile app and give the app access to
                    your contacts and photo library, you are entrusting data to us. The data
                    you entrust to us for processing is called service data.
                  </span>
                </h2>
                <p style={{ textIndent: "0pt", textAlign: "left" }}>
                  <br />
                </p>
                <p style={{ paddingLeft: "5pt", textIndent: "0pt", textAlign: "justify" }}>
                  You own your service data. We protect it, limit access to it, and only
                  process it according to your instructions. You may access it, share it
                  through third party integrations, and request that we export or delete it.
                </p>
                <p
                  style={{
                    paddingTop: "3pt",
                    paddingLeft: "5pt",
                    textIndent: "0pt",
                    textAlign: "justify"
                  }}
                >
                  We hold the data in your account as long as you choose to use CASANTEY
                  Services. After you terminate your account, your data will be automatically
                  deleted from our active database within 6 months and from our backups within
                  3 months after that.
                </p>
                <p style={{ textIndent: "0pt", textAlign: "left" }}>
                  <br />
                </p>
                <p style={{ paddingLeft: "5pt", textIndent: "0pt", textAlign: "justify" }}>
                  If you are in the European Economic Area and you believe that someone has
                  entrusted your information to us for processing (for instance, your employer
                  or a company whose services you use), you can request certain actions from
                  us regarding your data. To exercise those data rights, please contact the
                  person or company that entrusted the data to us and we will work with them
                  on your request.
                </p>
                <p style={{ textIndent: "0pt", textAlign: "left" }}>
                  <br />
                </p>
                <p style={{ paddingLeft: "5pt", textIndent: "0pt", textAlign: "justify" }}>
                  <a
                    href="https://www.zoho.com/privacy.html#part-three"
                    className="a"
                    target="_blank"
                  >
                    Part III –{" "}
                  </a>
                  <a href="https://www.zoho.com/privacy.html#part-three" target="_blank">
                    General
                  </a>
                </p>
                <p
                  style={{
                    paddingTop: "1pt",
                    paddingLeft: "5pt",
                    textIndent: "0pt",
                    textAlign: "justify"
                  }}
                >
                  There are some limitations to the privacy we can promise you. We will
                  disclose personal information if it's necessary to comply with a legal
                  obligation, prevent fraud, enforce an agreement, or protect our users'
                  safety. We do not currently honor Do Not Track signals from internet
                  browsers; when a universal standard for processing them emerges, we will
                  follow it.
                </p>
                <p style={{ textIndent: "0pt", textAlign: "left" }}>
                  <br />
                </p>
                <p style={{ paddingLeft: "5pt", textIndent: "0pt", textAlign: "justify" }}>
                  Third-party websites and social media widgets have their own separate
                  privacy policies. Always check the relevant privacy policy before sharing
                  personal information with third parties.
                </p>
                <p style={{ textIndent: "0pt", textAlign: "left" }}>
                  <br />
                </p>
                <p style={{ paddingLeft: "5pt", textIndent: "0pt", textAlign: "justify" }}>
                  You can always contact us to: ask questions about our privacy practices,
                  request a GDPR-compliant Data Processing Addendum, alert us if you believe
                  we have collected personal data from a minor, or ask to have your personal
                  information removed from our blogs or forums. You can also check our{" "}
                  <span className="s1">Security Policy </span>and{" "}
                  <span className="s1">Privacy Policy</span>
                </p>
                <p style={{ paddingLeft: "5pt", textIndent: "0pt", textAlign: "justify" }}>
                  We will contact you to let you know if we make any major changes to our
                  privacy policy, or in the highly unlikely event that we ever decide to sell
                  our business.
                </p>
              </>


            </PreviewCard>
          </Block>
        </div>
      </Content>
    </React.Fragment>
  );
};

export default Faq;
