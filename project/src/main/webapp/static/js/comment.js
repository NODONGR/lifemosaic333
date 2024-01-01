/**
 * comment.js
 * 
 */

 document.addEventListener('DOMContentLoaded', () =>{
    
    commentCheck();
    

    
// 해당 게시글에 코멘트 유무를 체크하는 함수
function commentCheck() {
    // 현재 게시글의 ID를 가져옴
    const post_id = document.querySelector('input#post_id').value;
    
    // 서버로 코멘트 여부 확인 요청을 보냄
    axios.get('../api/comment/check', { params: { post_id: post_id } })
        .then((response) => {
            // 서버 응답 로그를 출력
            console.log(response);
            
            // 코멘트가 없을 경우 emptyComment 함수 호출
            if (response.data === 0) {
                emptyComment();
            } 
            // 코멘트가 있을 경우 getAllComment 함수 호출
            else {
                getAllComment();
            }
        }) 
        .catch((error) => {
            // 오류가 발생한 경우 콘솔에 로그를 출력
            console.log(error);
        });
} // commentCheck 함수 끝

// 게시글에 코멘트가 없을 경우 표시할 내용을 출력하는 함수
function emptyComment() {
    const empty = document.querySelector('div#comments');
    
    // 해당 게시물에 아직 댓글이 없다는 내용을 표시
    empty.innerHTML = '<div> * 해당 게시물에 아직 댓글이 없습니다.</div>';
} // emptyComment 함수 끝

// 게시글에 코멘트가 있을 경우 코멘트 데이터를 가져오는 함수
function getAllComment() {
    const post_id = document.querySelector('input#post_id').value;
    
    // 서버로부터 해당 게시글의 코멘트 데이터를 가져옴
    axios.get('../api/comment/get', { params: { post_id: post_id } })
        .then((response) => {
            // 서버로부터 받은 데이터 로그를 출력
            console.log(response);
            
            // 가져온 데이터로 코멘트 요소를 생성하는 makeCommentElements 함수 호출
            makeCommentElements(response.data);
        })
        .catch((error) => {
            // 오류 발생 시 콘솔에 로그 출력
            console.log(error);
        });
} // getAllComment 함수 끝
    
    // 버튼 등록과 이벤트 리스너 등록
    const btnRegisterComment = document.querySelector('button#btnRegisterComment');
    btnRegisterComment.addEventListener('click', registerComment);
    
    function registerComment(event) {

        const post_id = document.querySelector('input#post_id').value;

        const ctext = document.querySelector('textarea#ctext').value;

        const writer = document.querySelector('input#writer').value;
        
        // 댓글 내용이 비어 있는 지 체크.
        if (ctext === '') {
            alert('댓글 내용을 입력하세요.');
            return; // 이벤트 콜백 종료
        }
        
         if (writer == '') {
        alert('로그인 후 댓글을 등록할 수 있습니다 로그인 페이지로 이동합니다.');
         window.location.href = '/project/user/signin'; // 로그인 페이지로 이동
        return; // 함수 종료.
    }

        const data = { post_id, ctext, writer };
        console.log(data);
        
        // POST 방식의 Ajax 요청을 보냄. 응답/실패 콜백을 등록.
        axios.post('../api/comment', data) // post 방식의 Ajax 요청으로 data를 보냄.
            .then((response) => {
                console.log(response);
                if (response.data === 1) {
                    document.querySelector('textarea#ctext').value = '';
                    getAllComment();
                }
            }) 
            .catch((error) => {
                console.log(error);
            });
    } // end function registerComment
    
    function makeCommentElements(data) {
    const commentsContainer = document.querySelector('div#comments');
    const pageContainer = document.querySelector('div#pageContainer');

    const comments = data.comments;
    const pageMaker = data.pageMaker;

    let html = '';

    comments.forEach((comment) => {
        const mdate = new Date(comment.comment_created_time);
        const cdate = new Date(comment.comment_modified_time);

        const formattedmDate = timeAgo(mdate);
        const formattedcDate = timeAgo(cdate);

        html += `<div class="mx-5 my-2">
                    <input class="d-none" id="${comment.comment_id}"/>
                    <span>${comment.nickname}</span> 
                    <small class=time>${formattedmDate}</small>`;
        if (formattedcDate !== formattedmDate) {
            html += `<small> <strong> *수정됨 </strong> </small>`;
        }

        html += `<div style="float: right;">
                    <small id="commentLike" data-id="${comment.comment_id}" style="cursor: pointer;">👍좋아요</small>
                    <small>${comment.like_point}</small>
                    <small id="commentDisLike" data-id="${comment.comment_id}" style="cursor: pointer;">👎싫어요</small>
                    <small>${comment.dislike_point}</small>`;
        if (signedInUser === comment.user_id) {
            html += `<small class="btnCommentModify" data-id="${comment.comment_id}" style="cursor: pointer;"> 수정</small>
                    <small class="btnCommentDelete" data-id="${comment.comment_id}" style="cursor: pointer;">삭제</small>`;
        }

        html += `</div>
                    <div>
                        <h6>${comment.comment_content}</h6>
                    </div>
                    <div>
                        <small data-id="${comment.comment_id}"id="showRecomment" style="cursor: pointer;">답글 보기 ▼</small>
                    </div>
                    <div class="multiUseDiv" data-id="${comment.comment_id}"></div>
                </div>
                <hr />`;
    });

    commentsContainer.innerHTML = html;

    let pageHtml = '';

    pageHtml += `<nav aria-label="Page navigation example">
                    <ul class="pagination justify-content-center">`;
    if (pageMaker.prev) {
        pageHtml += `<li class="page-item">
                        <a class="page-link"
                        value="${pageMaker.startPage - 1}">Previous</a>
                    </li>`;
    }

    const startPage = pageMaker.startPage;
    const endPage = pageMaker.endPage;
    const pageNum = pageMaker.cri.pageNum;

    for (let num = startPage; num <= endPage; num++) {
        const isActive = (pageNum === num) ? 'active' : '';
        const link = (pageNum === num) ? '<span class="page-link disabled">' + num + '</span>' :
            '<a class="page-link" value="' + num + '">' + num + '</a>';

        pageHtml += '<li class="page-item ' + isActive + '">' + link + '</li>';
    }

    if (pageMaker.next) {
        html += `<li class="page-item"><a class="page-link"
                value=${pageMaker.endPage + 1}">Next</a>
                </li>`;
    }
    pageHtml += `</ul>
                </nav>`;

    pageContainer.innerHTML = pageHtml;

    addPageLinkEventListeners();
    addCommentModifyEventListeners();
    addCommentDeleteEventListeners();
    addShowRecommentEventListeners();
}

    
    // 페이지 버튼에 이벤트 리스너를 추가
    function addPageLinkEventListeners() {
        const pageLinks = document.querySelectorAll('a.page-link');
        const post_id = document.querySelector('input#post_id').value;
        pageLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const pageNum = this.getAttribute('value');
                console.log(pageNum);
                
            axios.get('../api/comment/get', { params: {post_id: post_id, pageNum: pageNum} })
            .then((response) => {
                console.log(response);
                makeCommentElements(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
                
            });
        });
    } //end addPageLinkEventListeners
    
    function addCommentModifyEventListeners() {
        const btnCommentModifyElements = document.querySelectorAll('small.btnCommentModify');
        btnCommentModifyElements.forEach(btn => {
          btn.addEventListener('click', function() {
            const comment_id = this.getAttribute('data-id');
            const multiUseDiv = document.querySelector(`div.multiUseDiv[data-id="${comment_id}"]`);
        
            // 수정할 댓글을 입력할 input 요소를 동적으로 생성하여 multiUseDiv에 추가
            multiUseDiv.innerHTML = `<textarea class="form-control" id="recommentText"placeholder="수정할 댓글 입력"></textarea>
                                    <button class="btn btn-outline-success" id="btnRegisterRecomment">등록</button>`
            
            // 수정된 댓글 저장 버튼 클릭 이벤트 처리
            const btnRegisterRecomment = document.querySelector('button#btnRegisterRecomment');
            btnRegisterRecomment.addEventListener('click', function() {

                const ctext = document.querySelector('textarea#recommentText').value;

        
        // 댓글 내용이 비어 있는 지 체크.
                if (ctext === '') {
                    alert('댓글 내용을 입력하세요.');
                    return; // 이벤트 콜백 종료
                }

                const data = { comment_id, ctext };
                console.log(data);
              
                axios.put('../api/comment/update', data)
                .then((response) => {
                    console.log(response);
                    getAllComment();
                })
                .catch((error) => {
                    console.log(error);
                });
              
             });
          });
        });
    }
    

    
    function addCommentDeleteEventListeners() {
        const btnCommentDeleteElements = document.querySelectorAll('small.btnCommentDelete');
        btnCommentDeleteElements.forEach(btn => {
          btn.addEventListener('click', function() {
            const comment_id = this.getAttribute('data-id');
            console.log(comment_id);
            const uri = `../api/comment/${comment_id}`
                axios.put(uri)
                .then((response) => {
                    console.log(response);
                    getAllComment();
                })
                .catch((error) => {
                    console.log(error);
                });
          });
        });
    }
    
    // 대댓글 버튼에 이벤트리스너 등록
    function addShowRecommentEventListeners() {
        const btnCommentShowRecommentElements = document.querySelectorAll('small#showRecomment')
        
        btnCommentShowRecommentElements.forEach(btn => {
            
            btn.addEventListener('click', ShowRecomment);
        });
    }
    
    function ShowRecomment(c_id) {
                let comment_id;
                if (this instanceof HTMLElement) {
                  comment_id = this.getAttribute('data-id');
                } else {
                  // 예외 처리를 원하는 코드를 작성하세요
                  comment_id = c_id;
                }
                console.log(comment_id);
                
                const multiUseDiv = document.querySelector(`div.multiUseDiv[data-id="${comment_id}"]`);
                console.log(multiUseDiv)
                
                axios.get('../api/comment/recomment', { params: {comment_id: comment_id} })
                .then((response) => {
                console.log(response);
                
                const recomments = response.data;
                
                let html = '';
            
                recomments.forEach((recomment) => {
                    
                // 댓글의 생성 시간과 수정 시간을 JavaScript Date 객체로 변환.
		        const recommentcTime =  new Date(recomment.recomment_created_time);
		        const recommentmTime = new  Date(recomment.recomment_modified_time);
		        
		        // 댓글의 생성 시간과 수정 시간을 '몇 분 전', '몇 시간 전'과 같은 형식으로 변환.
		        const formattedmDate = timeAgo(recommentcTime);
		        const formattedcDate = timeAgo(recommentmTime);
                
                html += `<div class="mx-5 my-2">
                            <input class="d-none" id="${recomment.re_comment_id}"/>
                            <span id="nickname">  ${recomment.nickname}</span> 
                            <small class=time>${formattedmDate}</small>`;
                    if(formattedcDate !== formattedmDate){
    
                    html += `<small> <strong> *수정됨 </strong> </small>`;
                    }
                       
                html += `<div style="float: right;">
                            <small id="commentLike" data-id="${recomment.re_comment_id}" style="cursor: pointer;">👍좋아요</small>
                            <small>${recomment.like_point}</small>
                            <small id="commentDisLike" data-id="${recomment.re_comment_id}" style="cursor: pointer;">👎싫어요</small>
                            <small>${recomment.dislike_point}</small>`;
                    if(signedInUser === recomment.user_id) {
            
                    html+= `<small class="btnRecommentDelete" data-id="${recomment.re_comment_id}" style="cursor: pointer;">삭제</small>`;
                    }
                        
                html += `   </div>
                            <div class="recommentContent" data-id="${recomment.re_comment_id}">
                                <h6>${recomment.recomment_content}</h6>
                            </div>
                            </div>
                            <hr />`;
                }); 
                html += `   <div class="row mx-5 my-2">
                                <div class="col-10">
                                <textarea class="form-control" id="rtext" placeholder="답글 입력"></textarea>
                            </div>
                            <div class="col-2">
                                <button class="btnRegisterRecomment btn btn-outline-success" data-id="${comment_id}">등록</button>
                            </div>
                            </div>
                            `                
                multiUseDiv.innerHTML = html;
                
                const btnRegisterRecomment = document.querySelector(`button.btnRegisterRecomment[data-id="${comment_id}"]`);
                btnRegisterRecomment.addEventListener('click', registerRecomment);
                
                const btnRecommentDelete = document.querySelectorAll('small.btnRecommentDelete')
                btnRecommentDelete.forEach(btn => {
                   btn.addEventListener('click', RecommentDelete);
                });
                
                })
                .catch((error) => {
                console.log(error);
                });
                
                switchRecommentBtn(comment_id);
                
    }
    
    
   // 답글을 등록하는 함수. 클릭한 요소의 데이터 ID를 가져옴.
function registerRecomment() {
    // 여기서 클릭한 요소의 데이터 ID를 가져옴.
    const comment_id = this.getAttribute('data-id');
    
    // 답글을 입력하는 텍스트 영역에서 값을 꺼내오고, 거기서 공백을 없애줌.
    const rtext = document.querySelector('textarea#rtext').value.trim();
    
    // 로그인된 사용자 정보.
    const writer = document.querySelector('input#writer').value;
    
    // 로그인한 사용자가 아니라면 댓글을 등록할 수 없다고 알려줌.
    if (writer == '') {
        alert('로그인 후 대댓글을 등록할 수 있습니다 로그인 페이지로 이동합니다.');
         window.location.href = '/project/user/signin'; // 로그인 페이지로 이동
        return; // 함수 종료.
    }

    // 답글 내용이 비어 있는지 확인해. 만약 비어 있으면 알려줌.
    if (rtext === '') {
        alert('답글 내용을 입력해주세요.');
        return; //  함수 종료.
    }


    // 데이터를 객체로 만들어서 보냄.
    const data = { comment_id, rtext, writer };
    console.log(data);

    // 서버로 데이터를 보내서 답글을 등록.
    axios.post('../api/comment/recomment', data)
        .then((response) => {
            console.log(response);
            // 등록이 성공했을 때 답글 입력창을 비움.
            if (response.data === 1) {
                document.querySelector('textarea#rtext').value = '';
                // 답글 등록 후 답글 목록을 다시 보여줌.
                ShowRecomment(comment_id);
            }
        })
        .catch((error) => {
            console.log(error);
        });
}
    
// 댓글 삭제 함수
function RecommentDelete() {
  const re_comment_id = this.getAttribute('data-id'); // 삭제할 댓글의 ID를 가져옴
  const uri = `../api/comment/recomment/${re_comment_id}`; // 삭제할 댓글에 대한 API 엔드포인트 URI
  
  const confirmDelete = confirm('정말로 댓글을 삭제하시겠습니까?'); // 삭제하기 전에 사용자에게 확인
  
  if (confirmDelete) {
    axios.put(uri, { user_id: '알 수 없음' }) // 해당 댓글의 닉네임을 '알 수 없음'으로 변경하여 서버에 전달
      .then((response) => {
        console.log(response);
        const recommentContent = document.querySelector(`div.recommentContent[data-id="${re_comment_id}"]`);
        recommentContent.innerHTML = '<h6>삭제된 댓글입니다.</h6>'; // 댓글 내용을 '삭제된 댓글입니다.'로 변경
        
        const nickname = document.querySelector(`span#nickname`);
        if (nickname) {
          nickname.innerText = '알 수 없음'; // 해당 댓글의 닉네임을 화면에도 '알 수 없음'으로 변경
        }
        
        // 해당 댓글의 삭제 버튼을 찾아 숨김
        const deleteButton = document.querySelector(`span.btnRecommentDelete[data-id="${re_comment_id}"]`);
        if (deleteButton) {
          deleteButton.style.display = 'none'; // 삭제된 댓글의 삭제 버튼 숨김
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
    
    // 답글 접기로 버튼 변경
    function switchRecommentBtn(comment_id) {
        const showRecomment = document.querySelector(`small#showRecomment[data-id="${comment_id}"]`);
        console.log(showRecomment);
        showRecomment.innerHTML = '답글 접기 ▲'
        showRecomment.removeEventListener('click', ShowRecomment);
        showRecomment.addEventListener('click', HideRecomment);
    }
    
    // 답글 보기로 버튼 변경
    function HideRecomment() {
        const comment_id = this.getAttribute('data-id');
        const showRecomment = document.querySelector(`small#showRecomment[data-id="${comment_id}"]`);
        const multiUseDiv = document.querySelector(`div.multiUseDiv[data-id="${comment_id}"]`);
        multiUseDiv.innerHTML = '';
        showRecomment.innerHTML = '답글 보기 ▼'
        showRecomment.removeEventListener('click', HideRecomment);
        showRecomment.addEventListener('click', ShowRecomment);
    }
    
  function timeAgo(date) {
  // 현재 시간과 입력된 시간의 차이(초 단위)를 계산.
  const seconds = Math.floor((new Date() - date) / 1000);

  // 초 단위 간격으로 몇 초 전인지 계산.
  let interval = Math.floor(seconds / 60);
  if (interval < 1) {
    return `${Math.floor(seconds)}초 전`;
  }

  // 분 단위 간격으로 몇 분 전인지 계산.
  interval = Math.floor(seconds / 3600);
  if (interval < 1) {
    return `${Math.floor(seconds / 60)}분 전`;
  }

  // 시간 단위 간격으로 몇 시간 전인지 계산.
  interval = Math.floor(seconds / 86400);
  if (interval < 1) {
    return `${Math.floor(seconds / 3600)}시간 전`;
  }

  // 일 단위 간격으로 몇 일 전인지 계산.
  interval = Math.floor(seconds / 2592000); // 평균 월 길이: 30.44일
  if (interval < 1) {
    return `${Math.floor(seconds / 86400)}일 전`;
  }

  // 월 단위 간격으로 몇 개월 전인지 계산.
  interval = Math.floor(seconds / 31536000); // 평균 년 길이: 365.24일
  if (interval < 1) {
    return `${Math.floor(seconds / 2592000)}개월 전`;
  }

  // 년 단위 간격으로 몇 년 전인지 계산.
  return `${interval}년 전`;
}

    
    
    
    
});