import { Suspense } from "react";
import ActivateManager from "./ActivateManager";

export default function Page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ActivateManager />
        </Suspense>
    );
}