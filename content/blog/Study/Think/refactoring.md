---
title : "Refactoring과 CleanCode"
date : 2020-11-30 00:00:01
category : "Study"
draft : false
tag : "Think"
--- 

# Refactoring
* Class101 과제 피드백 이후, 제출했던 과제를 피드백에 따라 하나하나 수정해보았다.

## 코드의 가독성 문제
```javascript
// 변경 전
// 원래 이런코드는 아니였는데, 좀 더 확연한 차이를 보기 위해 살짝 수정했다.
function calcDiscount(price, coupon){
  let totalPrice = null;
  if(coupon){
    if(coupon.type === 'rate'){
      totalPrice = price - ((coupon.discountRate/100)*price);
    }else if(coupon.type === 'amount'){
      totalPrice = price - coupon.discountAmount;
    }
  }else{
    totalPrice = price;
  }
  return totalPrice;
}

// 변경 후
function calcDiscount(price, coupon){
  if(!coupon) return price;
  if(coupon.type === 'rate') return price - ((coupon.discountRate/100)*price);
  if(coupon.type === 'amount') return price - coupon.discountAmount;  
}
```
* 조건문 내부에 조건문이 더 있는것은, 매우 가독성이 떨어지는 프로그래밍이라고 한다.
* 들여쓰기가 많을수록 지저분한 코드라고 함..
* 따라서, 조기에 `return`을 시켜서 조건문을 탈출하는것이 좋다고 한다.
* 조기에 `return`을 시키기 때문에, 조건문의 위치가 매우 중요!
* 삼항연산자를 자주쓰는편인데, 안쓰는게 좋다고 함.. 매우충격

## 기능에 따라서, 컴포넌트를 좀 더 나눌 수 있었다.
* 3번문제와 연결되는것 같아, 3번에서 이야기해보자

## 컴포넌트의 역할과 책임에 대해 좀 더 고려해보기.
* 뷰와 비즈니스 로직이 혼재되어있어, 추후에 기능 변경등으로 인한 보수가 매우 어렵다.
* 이전까지는 내가 `Redux`를 사용함에 있어, 나는 단순히 `Flux`디자인패턴을 사용한다고 생각했다. 하지만 이번에 정말 나의 잘못된 생각이라는것을 느끼게되었다..

### 컨테이너 컴포넌트
* 사용하는 상태값을 조회하거나, 상태값에 변화를 주는 디스패쳐를 관리하는 컴포넌트이다. 즉, <b style="color : toamto;">비즈니스 로직</b>과 관련된 것을 관리하는 컴포넌트라 볼 수 있다.
* `JSX`는 사실상 거의 없는 수준이다.

### 프리젠테이셔널 컴포넌트
* 컨테이너 컴포넌트에서 만든 디스패쳐와 상태값들을 속성값으로 받아, 단순이 <b style="color : toamto;">뷰</b>화면만 그려주는 컴포넌트이다.
* 상태값에 직접 조회하는것이 아닌, 부모에게서부터 속성값으로 받기 때문에, 어디에서든 재활용이 가능하다.
* 프리젠테이셔널 컴포넌트는, 프리젠테이셔널 컴포넌트와 컨테이너 컴포넌트 둘다 가지고 있을 수 있다고 한다.
* 상태값에 조회할수 없을뿐이지, UI를 구성하는 메소드들은 사용이 가능하다.
> React Hook으로, UI와 관련되었을 경우 자신만의 상태값을 가지고 있을수 있다.

```javascript
// 컨테이너 컴포넌트 HomeContainer.js
function HomeContainer(){
  const {hotItems, cart} = SetHotItmes();
  const dispatch = useDispatch();
  const insertCart = useCallback((data) => {
    dispatch(Actions.insertCart(data))
  }, [dispatch])
  const deleteCart = useCallback((id) => {
    dispatch(Actions.deleteCart(id))
  }, [dispatch])
  return <Home 
            hotItems={hotItems} 
            cart={cart}
            insertCart={insertCart}
            deleteCart={deleteCart}
          />;
}

function SetHotItmes(){
  const 
    {data : {productItems}, cart} = useSelector((state) => ({
      data : state.data,
      cart : state.cart
    }), (left, right) => {
      // App에서도 같은 부분이므로 하나로 합칠필요 있음.
      const leftString = Object.entries(left.cart).toString();
      const rightString = Object.entries(right.cart).toString();
      if(leftString !== rightString) return false;
      return true;
    });
  
  const hotItems = [...productItems].splice(0,3);

  return {hotItems, cart};
}

// 홈은 app에게 상속받는 props값이 없기 때문에, 이후에는 app으로 인한 렌더링이 필요 없음
export default React.memo(HomeContainer, () => true);

// 프리젠테이셔널 컴포넌트 Home.js
function Home({hotItems, insertCart, deleteCart, cart}){
  return(
    <div className="home routeComp">
      <div className="section">
        <div className="sectionTitle">인기강의 TOP3</div>
        <div className="hotItems sectionContent">
          {
            hotItems.map((item, index) => {
              return(
                <ProductsItem 
                  data={item} 
                  id={item.id}
                  key={item.id+index}
                  cart={cart}
                  insertCart={insertCart}
                  deleteCart={deleteCart}
                />
              )
            })
          }
        </div>
      </div>
    </div>
  )
};

export default Home;
```
* 생각해보네 예전에 Class로 컴포넌트를 만들 때, connect로 리덕스를 사용했었는데, 그때 그 역할이 컨테이너컴포넌트화하는거였다.

### 의문
* 사실, 컨테이너 컴포넌트나 프리젠테이셔널 컴포넌트로 분리하여 사용하는것은, Hook이 개발되기 전, 함수형 컴포넌트가 단순히 뷰 화면만 보여주던 때에 사용했다고 한다..
  > 현재, React Hook이 개발되고 나서도 위처럼 나누는지 아니면, 하나의 파일안에서 커스텀 훅으로 분리하여 관리하는지는 잘 모르겠다..
* 만약에, 속성값을 자식에게 건내주는것이 너무 여러번 있다면..?
  > 중간에 컨테이너 컴포넌트를 하나 추가해야겠지..? 프리젠테이셔널 컴포넌트는 상태값에 조회를 할 수 없고, 그렇다고 하나하나 일일이 넘겨주는건.. Redux Hook을 사용하는 의미가 없으니깐..
* 프리젠테이셔널 컴포넌트에 있는 다른컴포넌트의 경우, 그냥 import를 해도 되는걸까 아니면, 그것또한 속성값으로 전달받아야하나..?
  > 비즈니스 로직을 구분하는것이 주된 목표이기 때문에, 프리젠테이셔널 컴포넌트에서 import하는것은 크게 상관없을 듯 하다.

## 렌더링 최적화 측면의 문제
* 인라인 함수를 작성하거나, memoization이 되지 않아 비효율적이다.
  > 여기서 인라인함수는, `.map`등으로 컴포넌트를 반복생성할 때, 동일한 함수가 지속적으로 생성되는것을 찝어주신것 같다.
* useCallback을 사용하여, 반복적으로 생성되는 자식컴포넌트에게 메소드를 전달할 때에는 메소드가 캐싱되도록 한다.
  > 사용할 때, 영향을 받는 값이 있다면, 두번째 인자인 배열에 해당 값을 넣어 변경시 새롭게 생성되도록 한다.
* memo를 사용하여 하위컴포넌트의 불필요한 렌더링 제거.
  > 상위컴포넌트가 렌더링되었을 때, 관련이없는 하위컴포넌트도 렌더링이 된다. 첫번째 인자와 두번째 인자를 비교하여, 렌더링이 필요할 때만 false를 반환하도록 한다.
* Redux Hook에서 shallowEqual만 사용하면, 참조타입을 비교할 때 항상 false가 나오기 때문에, 작은 규모라면 문자열로 변경하거나 특정값을 비교하도록 하고, 큰 규모라면 lodash를 사요하도록 하자.

## 더 알아보는중
* 아직도 고민중이고 확실하지 않은 부분이 많아서 계속 알아보는 중이다..
* 아 그리고, 최근에 어떤 영상에서 리팩토링과 관련된 좋은 책을 추천해줬다. 현업에서 사수개발자들이 자주 추천해주는 책이라고 하는데, 나는 혼자서하니.. 흑흑 유튜브의 도움을 참 많이받는다..

## 참조
* [효율적인 디렉토리 구조](https://ahnheejong.name/articles/package-structure-with-the-principal-of-locality-in-mind/)
* [리팩토링 개정판(자바스크립트 버전)](https://www.aladin.co.kr/shop/wproduct.aspx?start=short&ItemId=236186172)