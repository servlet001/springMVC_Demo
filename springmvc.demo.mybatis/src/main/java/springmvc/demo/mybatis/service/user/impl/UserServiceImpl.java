/**
 * 
 */
package springmvc.demo.mybatis.service.user.impl;

import java.util.List;

import javax.annotation.Resource;

import org.apache.ibatis.session.SqlSession;
import org.springframework.stereotype.Service;

import springmvc.demo.mybatis.bean.user.User;
import springmvc.demo.mybatis.service.user.UserService;

/**
 * @author zhongli@isoftstone.com
 *
 */
@Service("userService")
public class UserServiceImpl implements UserService {
	@Resource
    private SqlSession sqlSession;
	
	@Override
	public User getUserById(Integer id) {
		User user = sqlSession.selectOne("springmvc.demo.mybatis.bean.user.mapper.getUserById", id);
		return user;
	}

	@Override
	public void save(User user) {
		sqlSession.insert("springmvc.demo.mybatis.bean.user.mapper.insertUser", user);
	}

	@Override
	public List<User> getAllUser() {
		return sqlSession.selectList("springmvc.demo.mybatis.bean.user.mapper.getAllUser");
	}
	
}
