import { atom, useAtom } from "jotai";
import { PostI } from "../components/Post";

const postsAtom = atom<Array<PostI>>([]);

export function usePostsAtom() {
	return useAtom(postsAtom);
}
