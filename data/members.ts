export interface MemberItem {
  name: string;
  role: string;
  image?: string;
}

export const MEMBERS: MemberItem[] = [
  { name: "Jão Noctus", role: "Engineer at ZBD", image: "/members/jao.png" },
  { name: "Lucas Ferreira", role: "Founder of Vinteum", image: "/members/lucas.png" },
  { name: "Pins", role: "Contributor to LND", image: "/members/pins.png" },
  { name: "Leonardo Lima", role: "BDK Maintainer", image: "/members/leonardo.png" },
  { name: "Joãozinho", role: "Bitcoin Dev Padawan", image: "/members/joaozinho.png" },
  { name: "Hiro", role: "Marketer at Satsconf", image: "/members/hiro.png" },
  { name: "TheMhv", role: "Cashu Dev", image: "/members/themhv.jpg" },
  { name: "Thaiz Batista", role: "Head of Operations at Vinteum", image: "/members/thaiz.png" },
  { name: "Caio Ueda Sampaio (K-YU)", role: "Contributor to Bitcoinfuzz", image: "/members/kyu.jpg" },
  { name: "Any cypherpunk", role: "", image: "/members/any.png" },
];
