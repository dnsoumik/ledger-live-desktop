// @flow
import React, { useMemo, memo } from "react";
import { useTranslation } from "react-i18next";
import { useNftMetadata } from "@ledgerhq/live-common/lib/nft/NftMetadataProvider";
import IconOpensea from "~/renderer/icons/Opensea";
import IconRarible from "~/renderer/icons/Rarible";
import IconGlobe from "~/renderer/icons/Globe";
import { openURL } from "~/renderer/linking";
import ContextMenuItem from "./ContextMenuItem";

type Props = {
  contract: string,
  tokenId: string,
  currencyId: string,
  leftClick?: boolean,
  children: any,
};

const currencyKeysMap = {
  ethereum: (t, metadata) => [
    metadata?.links?.opensea && {
      key: "opensea",
      label: t("NFT.viewer.actions.open", { viewer: "Opensea.io" }),
      Icon: IconOpensea,
      type: "external",
      callback: () => openURL(metadata.links.opensea),
    },
    metadata?.links?.rarible && {
      key: "rarible",
      label: t("NFT.viewer.actions.open", { viewer: "Rarible" }),
      Icon: IconRarible,
      type: "external",
      callback: () => openURL(metadata.links.rarible),
    },
    {
      key: "sep2",
      type: "separator",
      label: "",
    },
    metadata?.links?.etherscan && {
      key: "etherscan",
      label: t("NFT.viewer.actions.open", { viewer: "Explorer" }),
      Icon: IconGlobe,
      type: "external",
      callback: () => openURL(metadata.links.etherscan),
    },
  ],
  polygon: (t, metadata) => [
    metadata?.links?.opensea && {
      key: "opensea",
      label: t("NFT.viewer.actions.open", { viewer: "Opensea.io" }),
      Icon: IconOpensea,
      type: "external",
      callback: () => openURL(metadata.links.opensea),
    },
    metadata?.links?.rarible && {
      key: "rarible",
      label: t("NFT.viewer.actions.open", { viewer: "Rarible" }),
      Icon: IconRarible,
      type: "external",
      callback: () => openURL(metadata.links.rarible),
    },
    {
      key: "sep2",
      type: "separator",
      label: "",
    },
    metadata?.links?.polygonscan && {
      key: "polygonscan",
      label: t("NFT.viewer.actions.open", { viewer: "Explorer" }),
      Icon: IconGlobe,
      type: "external",
      callback: () => openURL(metadata.links.polygonscan),
    },
  ],
};

const NFTContextMenu = ({ leftClick, children, contract, tokenId, currencyId }: Props) => {
  const { t } = useTranslation();
  const { status, metadata } = useNftMetadata(contract, tokenId, currencyId);

  const menuItems = useMemo(
    () =>
      status === "loaded" && currencyKeysMap?.[currencyId]
        ? currencyKeysMap[currencyId](t, metadata)
        : [],
    [currencyId, metadata, status, t],
  );

  return (
    <ContextMenuItem leftClick={leftClick} items={menuItems}>
      {children}
    </ContextMenuItem>
  );
};

// $FlowFixMe
export default memo(NFTContextMenu);
