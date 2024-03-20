This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

After cloning this repo, open the directory through your VSCode. VSCode will handle the port forwarding for us and allow us to view the visualization in browser without setting up ssh forwarding ourselves. ([https://code.visualstudio.com/docs/remote/ssh](https://code.visualstudio.com/docs/remote/ssh))

To run this, we need to install nodejs and the npm package manager. This is the solution that worked for me on Slurm:
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash
nvm install node
```

Then, run the development server through the VSCode terminal:

```bash
npm run dev
```

In VSCode, an "Open Browser" prompt should popup. Click this button in VSCode to see the result.

## How is the Visualization Created? 

The json and image links should be pre-populated if you are git cloning this repo, so you shouldn't need to change these.

The tSNE data points are read in from `data_jsons/net1_tsne_data.json`.

The images themselves are loaded into the `public` directory as a symbolic link.

The entry point for the page is `app/page.js`, which loads the json and contains the plot and image.

The scatter plot code is in `components/customChart/ScatterPlot.jsx`

The page will auto-update as you edit any file.

## Learn More

This project was created with Next.js. 
To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!
