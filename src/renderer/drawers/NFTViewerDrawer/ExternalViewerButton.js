// @flow

import React, { useMemo, memo } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";
import DropDownSelector, { DropDownItem } from "~/renderer/components/DropDownSelector";
import IconDots from "~/renderer/icons/Dots";
import IconExternal from "~/renderer/icons/ExternalLink";
import IconOpensea from "~/renderer/icons/Opensea";
import IconRarible from "~/renderer/icons/Rarible";
import IconGlobe from "~/renderer/icons/Globe";
import { openURL } from "~/renderer/linking";

import type { DropDownItemType } from "~/renderer/components/DropDownSelector";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

import type { NFTMetadataResponse } from "@ledgerhq/live-common/lib/types";

const Separator: ThemedComponent<{}> = styled.div`
  background-color: ${p => p.theme.colors.palette.divider};
  height: 1px;
  margin-top: 8px;
  margin-bottom: 8px;
`;

const Item: ThemedComponent<{
  disableHover?: boolean,
}> = styled(DropDownItem)`
  width: 100%;
  cursor: pointer;
  white-space: pre-wrap;
  justify-content: space-between;
  align-items: center;
  display: flex;
`;

type ItemType = DropDownItemType & {
  icon?: React$Element<*>,
  onClick?: Function,
  type?: "separator",
};

type ExternalViewerButtonProps = {
  links: $PropertyType<$PropertyType<NFTMetadataResponse, "result">, "links">,
  contract: string,
  tokenId: string,
  currencyId: string,
};

const currencyKeysMap = {
  ethereum: (t, links) =>
    [
      links?.opensea && {
        key: "opensea",
        label: t("NFT.viewer.actions.open", { viewer: "Opensea.io" }),
        icon: <IconOpensea size={16} />,
        type: "external",
        callback: () => openURL(links.opensea),
      },
      links?.rarible && {
        key: "rarible",
        label: t("NFT.viewer.actions.open", { viewer: "Rarible" }),
        icon: <IconRarible size={16} />,
        type: "external",
        callback: () => openURL(links.rarible),
      },
      {
        key: "sep2",
        type: "separator",
        label: "",
      },
      links?.etherscan && {
        key: "etherscan",
        label: t("NFT.viewer.actions.open", { viewer: "Explorer" }),
        icon: <IconGlobe size={16} />,
        type: "external",
        callback: () => openURL(links.etherscan),
      },
    ].filter(x => x),
  polygon: (t, links) =>
    [
      links?.opensea && {
        key: "opensea",
        label: t("NFT.viewer.actions.open", { viewer: "Opensea.io" }),
        icon: <IconOpensea size={16} />,
        type: "external",
        callback: () => openURL(links.opensea),
      },
      links?.rarible && {
        key: "rarible",
        label: t("NFT.viewer.actions.open", { viewer: "Rarible" }),
        icon: <IconRarible size={16} />,
        type: "external",
        callback: () => openURL(links.rarible),
      },
      {
        key: "sep2",
        type: "separator",
        label: "",
      },
      links?.polygonscan && {
        key: "polygonscan",
        label: t("NFT.viewer.actions.open", { viewer: "Explorer" }),
        icon: <IconGlobe size={16} />,
        type: "external",
        callback: () => openURL(links.polygonscan),
      },
    ].filter(x => x),
};

const ExternalViewerButton = ({
  links,
  contract,
  tokenId,
  currencyId,
}: ExternalViewerButtonProps) => {
  const { t } = useTranslation();

  const items: DropDownItemType[] = useMemo(
    () => (currencyKeysMap?.[currencyId] ? currencyKeysMap[currencyId](t, links) : []),
    [currencyId, links, t],
  );

  const renderItem = ({ item }: { item: ItemType }) => {
    if (item.type === "separator") {
      return <Separator />;
    }

    return (
      <Item
        id={`external-popout-${item.key}`}
        horizontal
        flow={2}
        onClick={item.onClick}
        disableHover={item.key === "hideEmpty"}
      >
        <Box horizontal>
          {item.icon ? <Box mr={2}>{item.icon}</Box> : null}
          {item.label}
        </Box>
        <Box ml={4}>
          <IconExternal size={16} />
        </Box>
      </Item>
    );
  };

  return (
    <DropDownSelector
      buttonId="accounts-options-button"
      horizontal
      items={items}
      renderItem={renderItem}
    >
      {() => (
        <Box horizontal>
          <Button small primary flow={1} style={{ height: 40 }}>
            <IconDots size={14} />
          </Button>
        </Box>
      )}
    </DropDownSelector>
  );
};

// $FlowFixMe
export default memo(ExternalViewerButton);
