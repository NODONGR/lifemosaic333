package com.itwill.project.service;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.springframework.jdbc.core.metadata.PostgresCallMetaDataProvider;
import org.springframework.stereotype.Service;

import com.itwill.project.domain.Post;
import com.itwill.project.dto.post.PostCreateDto;
import com.itwill.project.dto.post.PostListItemDto;
import com.itwill.project.repository.PostDao;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class PostService {
    
    private final PostDao postDao;


    public List<PostListItemDto> read(Long pageEnd, Long pageStart) {
        
        List<Post> list = postDao.selectOrderByDesc(pageEnd, pageStart);
        log.debug("전체포스트 목록 개수 = {}", list.size());
        
        return list.stream().map(PostListItemDto::fromEntity).toList();
    }
    
    public List<PostListItemDto> readBySubCategoryId(Long subCategoryId, Long pageEnd, Long pageStart) {
        
        List<Post> list = postDao.selectBySubCategoryIdOrderByDesc(subCategoryId, pageEnd, pageStart);
        log.debug("전체포스트 목록 개수 = {}", list.size());
        
        return list.stream().map(PostListItemDto::fromEntity).toList();
    }
    
    public Long getTotal() {
        
        return postDao.postCount();
    }
    
    public Long getTotal(Long subCategoryId) {
        
        return postDao.postCountBySubCategoryId(subCategoryId);
    }

<<<<<<< HEAD

=======
    public int create(PostCreateDto dto) {
        
        int result = postDao.insert(dto.toEntity());
        log.debug("create result = {}", result);
        
        return result;
    }
>>>>>>> 176df4fc780cc99689204beba306929a1d129b77
}
