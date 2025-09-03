import React from 'react';
import Thumbnail from "@site/src/components/Thumbnail";
import Basics from "@site/static/icons/book-open-01.svg";
import GraphQLAPI from "@site/static/icons/graphql-logo.svg";
import ChevronRight from "@site/static/icons/chevron-right.svg";
import Quickstart from "@site/static/icons/cloud-lightning.svg";
import Introduction from "@site/static/icons/award-02.svg";
import { OverviewIconCard } from "@site/src/components/OverviewIconCard";
import Link from "@docusaurus/Link";
import DemoGallery from "@site/src/components/DemoGallery";
import AuthenticationPrompt from "@site/src/components/AuthenticationPrompt";
import IndexPageSidebarController from "@site/src/components/IndexPageSidebarController";

interface DocsIndexContentProps {
  showSidebarController?: boolean;
  showTitle?: boolean;
  className?: string;
}

/**
 * Shared content component for the docs index page
 * Can be used in both the MDX docs/index.mdx and the login page
 */
export const DocsIndexContent: React.FC<DocsIndexContentProps> = ({
  showSidebarController = true,
  showTitle = false,
  className = ""
}) => {
  return (
    <div className={className}>
      {showTitle && <h1>PromptQL Documentation</h1>}

      {showSidebarController && <IndexPageSidebarController />}
      
      <div className={'front-matter'}>
        <div>
          <p>
            Talk to all your data and automate tasks using natural language, with the accuracy and reliability of a human expert.
            <br /><br />
            <a href="https://promptql.io">PromptQL</a> is an AI platform for building agents that speak your business's language, and can understand and act on your data <b>deterministically</b>.
            <br /><br />
            Answer deep questions or build new automations to unlock insights your employees and customers can rely on.
            <br /><br />
            Instantly. Reliably. Accurately.
          </p>
        </div>
        <div className={'video-wrapper'}>
          <div className={'video-aspect-ratio'}>
            <iframe
              src={"https://www.youtube.com/embed/FrffdbZq9Ow"}
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </div>

      <AuthenticationPrompt
        title="Access Full Documentation"
      />
    </div>
  );
};

export default DocsIndexContent;
