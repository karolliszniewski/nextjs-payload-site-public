# NextJS Payload Site

## Live Preview

🌐 [View Demo](https://nextjs-payload-site-karolliszniewskis-projects.vercel.app)

## Getting Started

### Clone Repository

```bash
git clone https://github.com/karolliszniewski/nextjs-payload-site.git
```

### Navigate to Project Directory

Navigate to Project Directory

```bash
cd nextjs-payload-site
```

### Install Dependencies

```bash
npm i
```

### Run Development Server

```
npm run dev
```

### View Local Project

Once the development server is running, open your browser and visit:
🌐 [http://localhost:3000](http://localhost:3000)

#### This project was initially created using the following command:

```bash
npx create-payload-app
```

#### Collection and Data

After creating the project, I added a new collection and populated it with data.
The Pins are fetched from an endpoint defined using Payload CMS. A NoSQL database is connected to Payload, allowing it to read and write data. This is achieved by simply adding the collection to the `payload.config.ts` file.

<img width="469" alt="image" src="https://github.com/user-attachments/assets/6903e24f-cdf3-4967-94e1-ba52669d182c" />

#### Location Pages

For creating location pages, I created the file `src/app/(frontend)/location/[slug]/page.tsx`, which is automatically treated as a dynamic slug route.
Here, a JSON object is fetched, and based on that data, information about the specific location is displayed.

<img width="463" alt="image" src="https://github.com/user-attachments/assets/6f43c13d-eb4f-4d15-a8f6-6b8b2cda4012" />

#### Contact Form

I also implemented a contact form that displays the form content once submitted.
![image](https://github.com/user-attachments/assets/3775790a-7237-4a01-aa5a-6edf00a0e59d)

#### Validation

The contact form includes:
Email validation to ensure the email entered is in a valid format.

![image](https://github.com/user-attachments/assets/5290f314-c13b-4f8f-abc5-97201916abb4)

Required field validation to ensure all necessary fields are filled out.

![image](https://github.com/user-attachments/assets/ef78a9f1-760a-4d1a-b60c-56e9a6702156)
