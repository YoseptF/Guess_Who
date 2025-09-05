export interface AvatarCharacter {
  _id: string;
  name: string;
  photoUrl?: string;
  allies?: string[];
  enemies?: string[];
  profession?: string;
  position?: string;
  predecessor?: string;
  affiliation?: string;
  first?: string;
  voicedBy?: string;
}
