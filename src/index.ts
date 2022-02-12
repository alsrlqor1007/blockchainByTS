import * as CryptoJS from "crypto-js";
// TS에서 import 형식

const name = 'mike',
  age = 30,
  gender = 'male';


const sayHi = (name: string, age: number, gender: string): void => {
    console.log(`Hi ${name}, you are ${age}, you are a ${gender}`);
};

sayHi(name, age, gender);
// 파라미터 중 하나라도 없으면 에러 표시를 해준다. 실수 방지
sayHi("joie", 28, "female");
// 함수에서 각 인수의 타입을 지정해줬기 때문에 다른 타입이 들어가면 에러를 표시한다.
// 아무 것도 지정하지 않았을 때 void는 어떤 유형의 값을 돌려주는지 나타내는 부분이다.


const sayHello = (name: string, age: number, gender: string): string => {
    return `Hello ${name}, you are ${age}, you are a ${gender}!`;
};

console.log(sayHello("Mike", 30, "male"));
// 리턴 값을 string으로 지정


const sayBye = (name, age, gender?) => {
    console.log(`Goodbye ${name}, you are ${age}, you are a ${gender}`);
};

sayBye(name, age);
// ?가 붙은 파라미터는 선택적 사용을 허용한다. undefined로 나오겠지만 에러라고 표시하지는 않는다.


interface Human {
  name: string;
  age: number;
  gender: string;
};
// interface는 자바스크립트에서는 작동하지 않는다. 타입스크립트에서만 읽는다.
// interface에 관한 것을 자바스크립트에 담고 싶을 때는 class를 활용한다.

const person = {
  name: "Joie",
  age: 28,
  gender: "female"
};

const sayYou = (person: Human): string => {
  return `You are ${person.name}, you are ${person.age}, you are a ${person.gender}!!`;
};

console.log(sayYou(person));

class Human2 {
  public name: string;
  public age: number;
  public gender: string;
  // private 변수는 밖에서 접근할 수 없다. 보호 기능을 할 수 있다.
  constructor(name: string, age: number, gender: string) {
    this.name = name;
    this.age = age;
    this.gender = gender;
  }
};

const lynn = new Human2("Lynn", 18, "female");

const sayYou2 = (person: Human2): string => {
  return `You are ${person.name}, you are ${person.age}, you are a ${person.gender}!!`;
};

console.log(sayYou2(lynn));




// Blockchain
class Block {
  // Block class 안에 있고 class가 생성되지 않아도 호출할 수 있는 Static Method
  // Block class 안에서 항상 사용 가능한 method
  static calculateBlockHash = (
    index: number, 
    previousHash: string, 
    timestamp: number, 
    data: string
  ): string => CryptoJS.SHA256(index + previousHash + timestamp + data).toString();

  static validateStructure = (aBlock: Block): boolean => 
    typeof aBlock.index === "number" &&
    typeof aBlock.hash === "string" &&
    typeof aBlock.previousHash === "string" &&
    typeof aBlock.timestamp === "number" &&
    typeof aBlock.data === "string";


  public index: number;
  public hash: string;
  public previousHash: string;
  public data: string;
  public timestamp: number;

  constructor (
    index: number,
    hash: string,
    previousHash: string,
    data: string, 
    timestamp: number ) {
      this.index = index;
      this.hash = hash;
      this.previousHash = previousHash;
      this.data = data;
      this.timestamp = timestamp;
    }
};

// Block.calculateBlockHash() // static이라서 사용 가능

const genesisBlock: Block = new Block(0, "2022", "", "Hello", 123456);

let blockchain: Block[] = [genesisBlock];
// blockchain에 Block class만 작성되도록 할 수 있다.

console.log(blockchain);

const getBlockchain = (): Block[] => blockchain;

const getLatestBlock = (): Block => blockchain[blockchain.length - 1];

const getNewTimeStamp = (): number => Math.round(new Date().getTime() / 1000);

// 새로운 Block 생성
const createNewBlock = (data: string): Block => {
  const previousBlock: Block = getLatestBlock();
  const newIndex: number = previousBlock.index + 1;
  const newTimestamp: number = getNewTimeStamp();
  const newHash: string = Block.calculateBlockHash(newIndex, previousBlock.hash, newTimestamp, data);
  const newBlock: Block = new Block(
    newIndex, newHash, previousBlock.hash, data, newTimestamp
  );
  addBlock(newBlock);
  return newBlock;
};

// console.log(createNewBlock("hello"), createNewBlock("bye bye"));

const getHashforBlock = (aBlock: Block): string => Block.calculateBlockHash(aBlock.index, aBlock.previousHash, aBlock.timestamp, aBlock.data);

// 해쉬가 정확한지 등 새로운 Block의 유효성 검사
const isBlockValid = (candidateBlock: Block, previousBlock: Block): boolean => {
  if (!Block.validateStructure(candidateBlock)) {
    // 만약 블록이 유효하면 구조 검증
    return false;
  } else if (previousBlock.index + 1 !== candidateBlock.index) {
    // 이전 블록의 index + 1 값과 candidate Block의 index 비교
    return false;
  } else if (previousBlock.hash !== candidateBlock.previousHash) {
    // hash 비교
    return false;
  } else if (getHashforBlock(candidateBlock) !== candidateBlock.hash) {
    // 해쉬를 따로 계산해서 들어온 블록의 해쉬가 실제로 있는지 일치 여부 체크
    return false;
  } else {
    return true;
  }
}; 

const addBlock = (candidateBlock: Block): void => {
  if (isBlockValid(candidateBlock, getLatestBlock())) {
    blockchain.push(candidateBlock);
  }
};

createNewBlock("second block");
createNewBlock("third block");
createNewBlock("fourth block");

console.log(blockchain);

export {};