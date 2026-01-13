# 📁 File Organization Guide

After downloading all the files individually, here's how to organize them:

## Step 1: Create This Folder Structure

Create a folder called `shopai-nextjs` on your computer (e.g., on Desktop or in C:\Projects\)

Then create these subfolders inside it:

```
shopai-nextjs/
├── app/
│   └── api/
│       └── search/
├── pages/
└── public/
```

## Step 2: Place Files in These Locations

### Root Folder Files (put directly in shopai-nextjs/)
- ✅ package.json
- ✅ next.config.js
- ✅ tailwind.config.js
- ✅ tsconfig.json
- ✅ postcss.config.js
- ✅ .gitignore
- ✅ setup.bat
- ✅ setup.sh
- ✅ README.md
- ✅ QUICKSTART.md
- ✅ MANUAL-SETUP-WINDOWS.md
- ✅ VIBE-CODING-SETUP.md
- ✅ CLAUDE-REFERENCE.md
- ✅ DEPLOYMENT.md

### App Folder Files (put in shopai-nextjs/app/)
- ✅ layout.tsx → `app/layout.tsx`
- ✅ page.tsx → `app/page.tsx`
- ✅ globals.css → `app/globals.css`

### API Route File (put in shopai-nextjs/app/api/search/)
- ✅ api-route.ts → RENAME to `route.ts` and put in `app/api/search/route.ts`

### Empty Folders (just create them, no files needed)
- `pages/` - empty folder
- `public/` - empty folder

## Step 3: Verify Your Structure

Your final folder structure should look like this:

```
shopai-nextjs/
├── app/
│   ├── api/
│   │   └── search/
│   │       └── route.ts          ← API endpoint
│   ├── layout.tsx                ← Layout & SEO
│   ├── page.tsx                  ← Main page
│   └── globals.css               ← Styles
├── pages/                        ← Empty folder
├── public/                       ← Empty folder
├── package.json                  ← Dependencies
├── next.config.js                ← Next.js config
├── tailwind.config.js            ← Tailwind config
├── tsconfig.json                 ← TypeScript config
├── postcss.config.js             ← PostCSS config
├── .gitignore                    ← Git ignore rules
├── setup.bat                     ← Windows setup
├── setup.sh                      ← Mac/Linux setup
├── README.md                     ← Documentation
├── QUICKSTART.md                 ← Quick start
├── MANUAL-SETUP-WINDOWS.md       ← Manual setup
├── VIBE-CODING-SETUP.md          ← Vibe coding
├── CLAUDE-REFERENCE.md           ← Quick reference
└── DEPLOYMENT.md                 ← Deployment guide
```

## Step 4: After Organizing Files

Open Command Prompt in the `shopai-nextjs` folder and run:

```cmd
npm install
```

This will download all the dependencies and set up your project!

## Quick Command to Create Folders (Windows)

Open Command Prompt and run:

```cmd
cd Desktop
mkdir shopai-nextjs
cd shopai-nextjs
mkdir app
cd app
mkdir api
cd api
mkdir search
cd ..\..\..
mkdir pages
mkdir public
```

Now just drag and drop the downloaded files into the right locations!

## Need Help?

If you're not sure where a file goes, check the structure above. The most important ones are:

1. **package.json** - Must be in root folder
2. **app/page.tsx** - Main page code
3. **app/api/search/route.ts** - API endpoint (rename from api-route.ts!)
4. **app/layout.tsx** - Site layout
5. **app/globals.css** - Styles

Once organized, you're ready to go! 🚀
