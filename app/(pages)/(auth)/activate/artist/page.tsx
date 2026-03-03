import { Suspense } from "react";
import ActivateArtistClient from "./ActivateArtistClient";

export default function Page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ActivateArtistClient />
        </Suspense>
    );
}