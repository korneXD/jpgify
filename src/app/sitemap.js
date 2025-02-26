import fs from "fs";
import path from "path";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

async function getLastModifiedDate(filePath) {
    filePath = path.join(process.cwd(), filePath);
    const stats = await fs.promises.stat(filePath);
    return stats.mtime;
}

export default async function sitemap() {
    const pageRoutes = ["", "about", "privacy-policy"];
    const staticRoutes = await Promise.all(
        pageRoutes.map(async (pageRoute) => {
            const lastModified = await getLastModifiedDate(
                `src/app/${pageRoute}/page.js`,
            );
            const page = pageRoute.replace(/\/?\(.*?\)/g, "").replace(/^\/+/, "");
            return {
                url: `${BASE_URL}/${page}`,
                lastModified,
            };
        }),
    );

    const sitemap = [...staticRoutes];

    return sitemap;
}
