#!/usr/bin/env zx

const options = {
  encoding: 'utf8',
};
const content = fs.readFileSync(path.resolve(__dirname, '../persona/魔术师.txt'), options);


/**
 * DLC\s+ => DLC,
 * \s\s(\S) => ,$1
 * \n, => ,
 * (\s\S+?), => $1|
 *
 * \s+ => |
 * ([^\|])\n => $1|\n
 * ^([^\|]) => |$1
 * \n+ => \n
 * 装备类型| => 装备类型|技能|\n|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|
 */

const markdownContent = content
  .replace(/DLC[^\S\r\n]+/g, 'DLC,')
  .replace(/\n\s*\n/g, '\n')
  .replace(/[^\S\r\n]{2}(\S)/g, ',$1')
  .replace(/\s*\n,/g, ',')
  .replace(/([^\S\r\n]\S+?),/g, '$1|')

  .replace(/[^\S\r\n]+/g, '|')
  // .replace(/([^\|])\n/g, '|\n|')
  .replace(/^([^\|\s])/gm, '|$1')
  .replace(/([^\||\s])$/gm, '$1|')
  .replace(/\|$/m, '|技能|\n|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|');

// console.log(markdownContent);

await fs.writeFile(path.resolve(__dirname, '../persona/魔术师test.txt'), markdownContent, options);
