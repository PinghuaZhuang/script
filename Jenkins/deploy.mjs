#!/usr/bin/env zx
import { zip, resolve, rmdir } from './utils.mjs';
import axios from 'axios';
import FormData from 'form-data';

const distH5Path = resolve('../dist/h5');
const partOfNames = JSON.parse(JSON.stringify(process.argv.slice(3)));
console.log('partOfNames', partOfNames);

const h5Files = await glob([`packages/@webview/!(core)/package.json`]);
const files = h5Files.map(path.dirname).map(o => path.basename(o));

let zipList = [];
if (partOfNames.length) {
  partOfNames.forEach((name) => {
    zipList.push(...files.filter((val) => val.indexOf(name) === 0));
  });
} else {
  zipList = files;
}
console.log('pipes', zipList);

await Promise.allSettled(
  zipList.map(async (name) => {
    const distPath = path.join(distH5Path, name);
    const distZip = path.join(distH5Path, `${name}.zip`);

    if (fs.existsSync(distPath)) {
      await rmdir(distPath);
    }
    if (fs.existsSync(distZip)) {
      await fs.unlinkSync(distZip);
    }
    await $`yarn workspace @webview/${name} run build:site`;
    await zip(distPath, distZip);

    const form = new FormData();
    form.append('dist.zip', fs.createReadStream(distZip));
    form.append('name', name);

    return await axios.post(
      `http://172.10.100.80:8082/view/%E4%B8%8A%E6%8A%95%E5%89%8D%E7%AB%AF/job/cifm-h5/buildWithParameters`,
      form,
      {
        params: {
          token: 'test',
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    ).then(async () => {
      console.log(`${name} 部署成功.`);
    }).catch(async () => {
      console.log(`${name} 部署失败.`);
    });
  }),
);

await $`exit 0`;
