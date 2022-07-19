## Notion API (js)를 사용한 notion page 생성 테스트
---
### 기본 참고 자료

[Notion API](https://developers.notion.com/docs/getting-started)

* postman collection 사용해서 테스트에 이용하려는 database, page, block에 대한 정보를 먼저 확인 후 코드에 적용하시면 편합니다. 

[integration token 발급 및 integration 공유](https://developers.notion.com/docs/getting-started#step-1-create-an-integration)

* 설명이 너무 잘 되어 있습니다! 따라하시면 됩니다.

[페이지 생성 api](https://developers.notion.com/reference/post-page)
[페이지 안에 block 추가 api](https://developers.notion.com/reference/patch-block-children)
[페이지 안에 database 추가 api](https://developers.notion.com/reference/create-a-database)


### 의존성 모듈

* @notionhq/client : notion sdk js
* node : 전역으로 설치되지 않았을 수도 있으니 포함. 
* dotenv : env file의 설정값 사용.

### env 추가할 것

* NOTION_API_KEY : 테스트하기 위해 발급한 integration token  
* NOTION_PARENT_DATABASE_ID : 테스트를 위해 해당 integration이 공유된 databse의 id
* MEMBERS : 공유할 말 블록에 들어갈 사용자 목록 
* TITLE : 해당 페이지의 날짜 멘션 뒤에 붙는 제목
* HEADING_1 : 인라인 데이터베이스의 제목
* HEADING_2 : 공유할 말 블록의 제목

### 주의 사항

* 코드 테스트 전 노션에 접속해서 키 발급과 테스트하려는 데이터베이스의 공유 항목에 integration 공유 처리 필수 : 위의 [integration token 발급 및 integration 공유](#기본-참고-자료) 확인
* parent database의 속성에 Name이 있어야 함. 해당 코드에 Name 속성으로 지정을 했기 때문. 다른 속성의 데이터베이스로 테스트 시 해당 속성값을 변경 후 테스트 하면 됨. 

### 처리 못 한 내용

* 인라인 데이터베이스의 속성에 하위 그룹핑 설정
    Assign 속성에 people 부분에 user list 불러와서 넣어주면 될 거 같은데 현재는 지원 안 하는 듯.
    [create a database - property schema obj](https://developers.notion.com/reference/property-schema-object#people-configuration) 

```	
notion.databases.create({
  .....
  properties: {
    Status: {
      name: 'Status',
      type: 'status',
      status: {},
    },
    Assign: {
      name: 'Assign',
      type: 'people',
      people: {},
    },
    Name: {
      name: 'Name',
      type: 'title',
      title: {},
    },
  }
})
```

