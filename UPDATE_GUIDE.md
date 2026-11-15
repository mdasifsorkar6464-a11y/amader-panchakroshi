# আমাদের পঞ্চক্রোশী — আপডেট নোট

এই সাইটটি বর্তমানে একটি হালকা static website। GitHub-এর `main` branch-এ পরিবর্তন গেলে Netlify-তে স্বয়ংক্রিয় deploy শুরু হওয়ার কথা।

## ভবিষ্যৎ আপডেটের নিয়ম
- নতুন তথ্য প্রকাশের আগে নির্ভরযোগ্য সূত্র বা ব্যবহারকারীর সরবরাহ করা প্রমাণ যাচাই করতে হবে।
- গ্রামের নাম, প্রতিষ্ঠান, ফোন নম্বর, ঠিকানা ও সেবার তথ্য অনুমান করে যোগ করা যাবে না।
- স্থানীয় খবর/ঘোষণা কেবল সাইটের মালিকের অনুমোদনে প্রকাশ করতে হবে; জনসাধারণের জন্য submission form যোগ করা যাবে না।
- পরিবর্তন feature branch-এ করে Pull Request-এর মাধ্যমে main-এ merge করতে হবে।
- merge-এর পরে homepage, search, internal links, mobile layout এবং Netlify deployment পরীক্ষা করতে হবে।
- Netlify deployment সফল হয়েছে বলে দাবি করার আগে live site খুলে যাচাই করতে হবে।

## বর্তমান কাঠামো
- `index.html`: মূল পৃষ্ঠা ও তথ্যভান্ডার
- `style.css`: নকশা ও responsive layout
- `script.js`: সাইটের search
- `manifest.webmanifest` ও `icon.svg`: browser/app identity
- `robots.txt` ও `sitemap.xml`: search engine discovery
- `404.html`: ভুল/অনুপস্থিত পৃষ্ঠার fallback
- `_headers`: Netlify response security headers
