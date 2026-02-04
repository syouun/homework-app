
const url = "https://www.amazon.co.jp/%E3%81%86%E3%82%93%E3%81%93%E3%83%89%E3%83%AA%E3%83%AB-%E3%81%8B%E3%82%93%E5%AD%97-%E5%B0%8F%E5%AD%A61%E5%B9%B4%E7%94%9F-%E3%81%86%E3%82%93%E3%81%93%E3%83%89%E3%83%AA%E3%83%AB%E3%82%B7%E3%83%AA%E3%83%BC%E3%82%BA-%E6%96%87%E9%9F%BF%E7%A4%BE/dp/4866511729/ref=asc_df_4866511729";

async function analyzeAmazon() {
    console.log("Fetching URL:", url);
    try {
        const res = await fetch(url, {
            headers: {
                "User-Agent": "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
                "Accept-Language": "ja,en-US;q=0.9,en;q=0.8"
            }
        });

        const html = await res.text();
        console.log("HTML Length:", html.length);

        // Check for og:image
        const ogImage = html.match(/<meta[^>]+(?:property|name)=["']og:image["'][^>]+content=["']([^"']+)["']|<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']og:image["']/i);
        console.log("og:image found:", ogImage ? (ogImage[1] || ogImage[2]) : "NONE");

        // Check for Amazon specific landingImage
        const landingImage = html.match(/id="landingImage"[^>]+src="([^"]+)"/i);
        console.log("landingImage found:", landingImage ? landingImage[1] : "NONE");

        // Check for data-a-dynamic-image
        // This usually contains a JSON object with URLs as keys
        const dynamicImage = html.match(/data-a-dynamic-image\s*=\s*"([^"]+)"/i);
        if (dynamicImage) {
            console.log("data-a-dynamic-image found string length:", dynamicImage[1].length);
            // It's encoded JSON, usually
            const unescaped = dynamicImage[1].replace(/&quot;/g, '"');
            console.log("Dynamic Image JSON snippet:", unescaped.substring(0, 100));
        } else {
            console.log("data-a-dynamic-image: NONE");
        }

        // Check for imgTagWrapperId
        const imgTagWrapper = html.match(/<div id="imgTagWrapperId"[^>]*>([\s\S]*?)<\/div>/i);
        if (imgTagWrapper) {
            console.log("imgTagWrapper found content length:", imgTagWrapper[1].length);
            const src = imgTagWrapper[1].match(/src="([^"]+)"/);
            console.log("imgTagWrapper src:", src ? src[1] : "NONE");
        } else {
            console.log("imgTagWrapperId: NONE");
        }

        // Look for large image URL patterns directly
        const largeJpg = html.match(/https:\/\/m\.media-amazon\.com\/images\/I\/[a-zA-Z0-9\-_]+\.jpg/g);
        if (largeJpg) {
            console.log("Found direct Media Amazon URLs (first 3):", largeJpg.slice(0, 3));
        }

    } catch (e) {
        console.error("Fetch failed:", e);
    }
}

analyzeAmazon();
