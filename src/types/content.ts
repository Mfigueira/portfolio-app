export type Project = {
  /** Rendered as 01 / 02 / 03 from array position, not stored. */
  title: string;
  /** Short qualifier, e.g. "Open source · ZetaChain". Omitted when not useful. */
  context?: string;
  /** Two lines. Longer than that and the card layout stops working. */
  pitch: string;
  tags: readonly string[];
  /** Absent links are not rendered at all — never as dead or disabled buttons. */
  liveUrl?: string;
  repoUrl?: string;
};

export type SkillGroup = {
  title: string;
  items: readonly string[];
};
