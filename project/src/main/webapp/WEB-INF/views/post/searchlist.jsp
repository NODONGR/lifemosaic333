<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8" trimDirectiveWhitespaces="true" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<%@ taglib prefix="fmt" uri="jakarta.tags.fmt" %>
<!DOCTYPE html>
<html>
	<head>
		<meta charset="UTF-8">
		<title>Life mosaic</title>
		<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" 
            rel="stylesheet" 
            integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" 
            crossorigin="anonymous">
        <link rel="stylesheet" href="./../css/main_navigation.css" />
	</head>
	
    <body>
	   <header>
	   </header>
	    
	    <!-- 내비게이션 include 시 경로 및 겹치는 div 만들어줘야 함 -->
	   <div class="container-fluid d-flex justify-content-center">
	   		<c:url var="imgPath" value="../img/logo.png" />
	         <%@ include file="../fragments/navigation.jspf" %>
	   </div>
	   <div style="margin:110px"></div>
 	   
 	   
 	   <!-- 메인 시작 -->
 	   <main>
 	   <div class="mx-5">
 	   <div class="container-fluid w-50">
			
			<%-- div 1. 검색 키워드 보여주기 --%>
 	    	<div class="d-flex justify-content-start mb-5 mt-4"><h3>"<strong  id="keyword">${searchKeyword.keyword }</strong>" 검색 결과</h3></div>
 	    	<div id="search_category" class= "d-none">${searchKeyword.search_category }</div>
 	   		
 	   		
 	   		<%-- div 2. 카테고리 및 정렬 --%>
 	   		<div class="d-flex justify-content-between">
				<div>
					<div class="dropdown">
						<button id="btnSelectCategory" class="px-2 py-1 btn dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false" >전체</button>
						  <ul id="sub_category" class="dropdown-menu" style="font-size:14px">
						  		<li><a class="dropdown-item" id="all" name="0">전체</a></li>
							    <li><a class="dropdown-item" id="fault" name="11">이거 내 잘못?</a></li>
							    <li><a class="dropdown-item" id="idiot" name="21">나 호구냐?</a></li>
							    <li><a class="dropdown-item" id="envy" name="31">부럽지?</a></li>
							    <li><a class="dropdown-item" id="car" name="41">차사고</a></li>
							    <li><a class="dropdown-item" id="game" name="42">게임</a></li>
							    <li><a class="dropdown-item" id="etc" name="43">기타</a></li>
							    <li><a class="dropdown-item" id="free" name="51">자유게시판</a></li>
						  </ul>
					</div>
				</div>
				
				
				<div>
					<button class="x-2 py-1 btn">
						<svg  class="me-1" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-down-up" viewBox="0 0 16 16">
						  <path fill-rule="evenodd" d="M11.5 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L11 2.707V14.5a.5.5 0 0 0 .5.5zm-7-14a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L4 13.293V1.5a.5.5 0 0 1 .5-.5z"/>
						</svg>
						<span id="orderSearchList">좋아요순</span>
					</button>
				</div>
 	   		</div>
 	   		
 	   		<hr/>
 	   
 	   		<!-- 자바 스크립트로 받기 -->
			<!-- 검색된 게시글 출력 -->
 	   		<div id="postTemplate"> 
 	   			보여줄 게시글
 	   		</div>
			  
 	   </div>	
 	   </div>
 	   
 	   
 	   <!-- 자바 스크립트로 받기 -->
 	   <!-- 페이지네이션 -->
 	   <div class="d-flex justify-content-center mt-5">
 	   <div id="pageTemplate">
 	   </div>
 	   </div>
			
       </main>
       
		
		<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" 
                integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" 
                crossorigin="anonymous"></script>
        <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
        <script src="../js/searchpageorder.js"></script>
	</body>
</html>